<script lang="ts">
	import Card, {
		Content,
		PrimaryAction,
		Media,
		MediaContent,
		Actions,
		ActionButtons,
		ActionIcons
	} from '@smui/card';
	import Button, { Label } from '@smui/button';
	import IconButton, { Icon } from '@smui/icon-button';

    // component props
	export let uploader: string = '';
	export let tags: string[] = [];
	export let postURL: string = '';

</script>

<Card style="width : 300px;">
	<PrimaryAction>
		<Media class="card-media-16x9" aspectRatio="16x9">
			<MediaContent>
				<div style="color: #fff; position: absolute; bottom: 16px; left: 16px;">
					<h2 class="mdc-typography--headline6" style="margin: 0;">A card with media.</h2>
					<h3 class="mdc-typography--subtitle2" style="margin: 0;">And a subtitle.</h3>
				</div>
			</MediaContent>
		</Media>
		<Content class="mdc-typography--body2">
			It's all in this card. It's a veritable smorgasbord of card features.
		</Content>
	</PrimaryAction>
	<Actions>
		<ActionButtons>
			<Button>
				<Label>Action</Label>
			</Button>
			<Button>
				<Label>Another</Label>
			</Button>
		</ActionButtons>
		<ActionIcons>
			<IconButton toggle aria-label="Add to favorites" title="Add to favorites">
				<Icon class="material-icons" on>favorite</Icon>
				<Icon class="material-icons">favorite_border</Icon>
			</IconButton>
		</ActionIcons>
	</Actions>
</Card>
