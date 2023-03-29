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

type DocRef = ReturnType<typeof doc>;
type MessageCollectionRef = ReturnType<typeof collection>;
type FireDB = ReturnType<typeof getFirestore>;
type CleanerFunction = ReturnType<typeof getCleanUp>;

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

const MESSAGES_PER_PAGE = 10;

class MessageManager {
	static DM_COLLECTIONS_NAME = 'directMessages';
	static MESSAGE_COLLECTIONS_NAME_IN_DM = 'messages';

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

		this._messageStore.update((allMessages) => {
			pageMessages.forEach((message) => {
				allMessages.splice(0, 0, message);
			});

			return allMessages;
		});
	}

	listenToMessages() {
		const messageQuery = query(this._messageCollectionRef, orderBy('sentAt', 'desc'), limit(1));

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

	async sendMessage(content: string) {
		const messageId = crypto.randomUUID();

		const messagePayload: Message = {
			id: messageId,
			content,
			senderId: this._sender.id,
			senderName: this._sender.name,
			sentAt: Date.now()
		};

		const newMessageDocRef = docRef(
			this._db,
			MessageManager.DM_COLLECTIONS_NAME,
			this._roomId,
			MessageManager.MESSAGE_COLLECTIONS_NAME_IN_DM,
			messageId
		);

		await setDoc(newMessageDocRef, { ...messagePayload });
	}

	destroy() {
		if (this._messageListenerCleanup) {
			this._messageListenerCleanup();
		}
	}
}

export default MessageManager;
