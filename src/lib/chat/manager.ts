import {
	type getFirestore,
	doc,
	type collection,
	type onSnapshot as getCleanUp,
	limit,
	getDocs,
	orderBy,
	where,
	startAfter,
	type DocumentData,
	QueryDocumentSnapshot
} from 'firebase/firestore';
import {
	doc as docRef,
	runTransaction,
	updateDoc,
	setDoc,
	collection as collectionRef,
	query,
	onSnapshot
} from 'firebase/firestore';
import fireDb from '$lib/database/firebaseClient';

import type { Writable } from 'svelte/store';
import { convertAndCleanRawMD } from '$lib/comments/markdownHelpers';

type DocRef = ReturnType<typeof doc>;
type MessageCollectionRef = ReturnType<typeof collection>;
type FireDB = ReturnType<typeof getFirestore>;
type CleanerFunction = ReturnType<typeof getCleanUp>;

const MESSAGES_PER_PAGE = 10;
export const MESSAGE_RATE_LIMIT_TIME_MS = 3000;
export const MAXIMUM_MESSAGE_LENGTH = 500;

export interface Message {
	id: string;
	senderId: string;
	senderName: string;
	content: string;
	sentAt: number;
}

interface Chatter {
	id: string;
	name: string;
}

export class RateLimitError extends Error {
	message: string;

	constructor(message: string) {
		super(message);
		this.message = message;
		this.name = 'RateLimitError';
		this.cause = 'Rate limiting';
	}
}

export class MessageTooLongError extends Error {
	message: string;

	constructor(message: string) {
		super(message);
		this.message = message;
		this.name = 'MessageTooLongError';
		this.cause = `Message length exceeded ${MAXIMUM_MESSAGE_LENGTH}`;
	}
}

export class EmptyMessageError extends Error {
	message: string;

	constructor(message: string) {
		super(message);
		this.message = message;
		this.name = 'EmptyMessageError';
		this.cause = 'Message was empty';
	}
}

class MessageManager {
	static DM_COLLECTIONS_NAME = 'directMessages';
	static MESSAGE_COLLECTIONS_NAME_IN_DM = 'messages';
	static MAX_MESSAGES_EVERY_THREE_SECONDS = 5;

	private _db: FireDB;
	private _roomId: string;
	private _messageStore: Writable<Message[]>;
	private _messageListenerCleanup: CleanerFunction | null;
	private _messageCollectionRef: MessageCollectionRef;
	private _dmDocRef: DocRef;
	private _sender: Chatter;
	private _receipient: Chatter;
	private _seenMessages: Set<string>;
	private _lastMessageDocRef: QueryDocumentSnapshot<DocumentData> | null;
	private _sentInLastInterval: number;
	private _rateLimiterIntervarId: NodeJS.Timer | null;

	constructor(
		roomId: string,
		messageStore: Writable<Message[]>,
		sender: Chatter,
		receipient: Chatter
	) {
		this._db = fireDb;
		this._roomId = roomId;
		this._messageStore = messageStore;
		this._sender = sender;
		this._receipient = receipient;
		this._dmDocRef = docRef(this._db, MessageManager.DM_COLLECTIONS_NAME, this._roomId);
		this._messageCollectionRef = collectionRef(
			this._db,
			MessageManager.DM_COLLECTIONS_NAME,
			this._roomId,
			MessageManager.MESSAGE_COLLECTIONS_NAME_IN_DM
		);
		this._messageListenerCleanup = null;
		this._seenMessages = new Set<string>();
		this._lastMessageDocRef = null;
		this._sentInLastInterval = 0;
		this._rateLimiterIntervarId = null;
	}

	async setup() {
		await runTransaction(this._db, async (transaction) => {
			const dm = await transaction.get(this._dmDocRef);
			if (!dm.exists()) {
				transaction.set(this._dmDocRef, {
					createdOn: new Date(Date.now()).toISOString()
				});
			}
		});

		await this.fetchMessages();
		this.listenToMessages();
		this.createRateLimitCounter();
	}

	async fetchMessages() {
		const paginationQuery = this._lastMessageDocRef
			? query(
					this._messageCollectionRef,
					orderBy('sentAt', 'desc'),
					startAfter(this._lastMessageDocRef),
					limit(MESSAGES_PER_PAGE)
			  )
			: query(this._messageCollectionRef, orderBy('sentAt', 'desc'), limit(MESSAGES_PER_PAGE));

		const messageDocsOnPage = await getDocs(paginationQuery);

		const pageMessages: Message[] = [];

		messageDocsOnPage.forEach((messageDoc) => {
			if (messageDoc.exists()) {
				const messageData = messageDoc.data() as Message;

				if (!this._seenMessages.has(messageData.id)) {
					pageMessages.push(messageData);
					this._seenMessages.add(messageData.id);
				}
			}
		});

		this._lastMessageDocRef = messageDocsOnPage.docs[messageDocsOnPage.docs.length - 1];

		if (this._lastMessageDocRef === undefined) return false;

		this._messageStore.update((allMessages) => {
			pageMessages.forEach((message) => {
				allMessages.splice(0, 0, message);
			});

			return allMessages;
		});

		return true;
	}

	listenToMessages() {
		const messageQuery = query(
			this._messageCollectionRef,
			where('senderName', '==', this._receipient.name),
			orderBy('sentAt', 'desc'),
			limit(1)
		);

		this._messageListenerCleanup = onSnapshot(messageQuery, (recentMessagesSnapshot) => {
			const newMessages: Message[] = [];

			recentMessagesSnapshot.forEach((messageDoc) => {
				if (messageDoc.exists()) {
					const messageData = messageDoc.data() as Message;

					if (!this._seenMessages.has(messageData.id)) {
						newMessages.push(messageData);
						this._seenMessages.add(messageData.id);
					}
				}
			});

			this._messageStore.update((allMessages) => {
				newMessages.forEach((message) => allMessages.push(message));
				return allMessages;
			});
		});
	}

	createRateLimitCounter() {
		this._rateLimiterIntervarId = setInterval(() => {
			this._sentInLastInterval = 0;
		}, MESSAGE_RATE_LIMIT_TIME_MS);
	}

	private _updateMessageStore(messagePayload: Message) {
		this._seenMessages.add(messagePayload.id);

		this._messageStore.update((allMessages) => {
			allMessages.push(messagePayload);
			return allMessages;
		});
	}

	async sendMessage(content: string) {
		
		if (this._sentInLastInterval > MessageManager.MAX_MESSAGES_EVERY_THREE_SECONDS) {
			throw new RateLimitError('Slow down');
		}

		if (!content.length) {
			throw new EmptyMessageError('Empty messages are not allowed');
		}

		if (content.length > MAXIMUM_MESSAGE_LENGTH) {
			throw new MessageTooLongError('The message is too long');
		}

		const messageId = crypto.randomUUID();

		const messagePayload: Message = {
			id: messageId,
			content: convertAndCleanRawMD(content),
			senderId: this._sender.id,
			senderName: this._sender.name,
			sentAt: Date.now()
		};

		this._updateMessageStore(messagePayload);

		const newMessageDocRef = docRef(
			this._db,
			MessageManager.DM_COLLECTIONS_NAME,
			this._roomId,
			MessageManager.MESSAGE_COLLECTIONS_NAME_IN_DM,
			messageId
		);

		await setDoc(newMessageDocRef, { ...messagePayload });
		this._sentInLastInterval++;
	}

	destroy() {
		if (this._messageListenerCleanup) {
			this._messageListenerCleanup();
		}
		if (this._rateLimiterIntervarId) {
			clearInterval(this._rateLimiterIntervarId);
		}
	}
}

export default MessageManager;
