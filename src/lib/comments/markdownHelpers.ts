import sanitizeHTML from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import MarkdownEmoji from 'markdown-it-emoji';

// @ts-ignore
import MarkdownNamedCodeBlocks from 'markdown-it-named-code-blocks';

const md = new MarkdownIt();
md.use(MarkdownEmoji);
md.use(MarkdownNamedCodeBlocks, { isEnableInlineCss: true });

const ACCEPTED_HTML_TAGS = ['strong', 'em', 'span', 'code', 'pre', 'a'];

export function convertAndCleanRawMD(rawMarkdown: string) {
	return sanitizeHTML(md.render(rawMarkdown), {
		allowedTags: ACCEPTED_HTML_TAGS
	});
}
