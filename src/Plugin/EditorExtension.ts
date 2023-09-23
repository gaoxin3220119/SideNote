import {
    ViewUpdate,
    PluginValue,
    EditorView,
    ViewPlugin,
} from "@codemirror/view";
import { App, MarkdownView, WorkspaceLeaf, setIcon } from "obsidian";
import MyPlugin from "src/main";
import { EditorState, Text, EditorSelection } from "@codemirror/state";


const label = "View notes";

const addSrcButton = (app: App, plugin: MyPlugin) => {
    const apply = () => app.workspace.iterateAllLeaves(addButton(app, plugin));
    app.workspace.onLayoutReady(apply);
    app.workspace.on("layout-change", apply);
};


const addButton = (app: App, plugin: MyPlugin) => (leaf: WorkspaceLeaf) => {
    if (
        leaf.view instanceof MarkdownView &&
        leaf.view.containerEl.querySelector(
            `a.view-action[aria-label="${label}"]`,
        ) === null
    ) {
        let view = leaf.view;
        let isWork = !plugin.settings.isDisplay; //false
        const buttonElement = view.addAction("pdf-file", label, (evt) => {

            const rightGutters = view.contentEl.querySelector('#right-gutters')

            if (isWork) {
                isWork = false
                rightGutters.setAttribute('style', 'display:block')
                rightGutters.setAttribute('style', `background-color:${plugin.settings.backgroundColor}!important;width:${plugin.settings.width}px;margin-right: 30px;position:relative;-webkit-box-sizing: content-box;padding: 10px;border: 1px solid #E0E0E0 !important;`);
                setIcon(buttonElement, 'pdf-file');
            } else {
                isWork = true
                rightGutters.setAttribute('style', 'display:none')
                setIcon(buttonElement, 'document');

            }

        });
    }
};

export default function EditingViewPlugin(app: App, plugin: MyPlugin) {


    return ViewPlugin.fromClass(
        class ExamplePlugin implements PluginValue {


            dom: HTMLElement;
            fixed: boolean;
            prevViewport: { from: number, to: number };
            view: EditorView

            constructor(view: EditorView) {
                this.prevViewport = view.viewport;
                this.dom = document.createElement('div');
                this.dom.className = 'cm-gutters';
                this.dom.setAttribute('style', `background-color:${plugin.settings.backgroundColor}!important;width:${plugin.settings.width}px;margin-right: 30px;position:relative;-webkit-box-sizing: content-box;padding: 10px;border: 1px solid #E0E0E0 !important;`);
                this.dom.setAttribute("id", "right-gutters")
                if (plugin.settings.isDisplay == false) {
                    this.dom.setAttribute('style', 'display:none')
                }
                this.dom.style.minHeight = view.contentHeight + 'px';
                view.scrollDOM.insertAfter(this.dom, view.contentDOM.nextSibling);
                addSrcButton(app, plugin)
                this.view = view
            }



            setCommnet(view: EditorView, update: ViewUpdate) {
                const _get_gutter = view.dom.querySelector('#right-gutters')
                if (_get_gutter) {
                    _get_gutter.empty()
                    const findComment = view.contentDOM.querySelectorAll(".comment")
                    if (findComment.length === 0) {
                        const findStyle = view.contentDOM.querySelectorAll(".cm-line")
                        findStyle.forEach($el => {
                            let getStyles = $el.getAttribute('style')
                            if (getStyles) {
                                if (getStyles.endsWith('top:0px')) {
                                    $el.removeAttribute('style')
                                };
                            }
                        })

                    }


                    findComment.forEach(element => {
                        if (element) {

                            const comments = document.createElement('div')
                            comments.style.top = element.parentElement.parentElement.parentElement.offsetTop - 30 + 'px'
                            comments.style.backgroundColor = plugin.settings.commentItmebackgroundColor
                            comments.style.color = plugin.settings.commentItmeColor
                            comments.style.fontSize = plugin.settings.commentItmefontSize
                            comments.addClass('rightComments')

                            //comments.setAttribute('style',`background: ${plugin.settings.commentItmebackgroundColor};`)
                            comments.innerHTML = element.innerHTML
                            _get_gutter.append(comments)

                            comments.ondblclick = (e) => {
                                comments.setAttribute('contenteditable', 'plaintext-only')
                                comments.style.cursor = 'text'
                                comments.style.border = '1px solid #00f'
                                comments.innerHTML = comments.innerHTML.replace(/(<h6>)([\s\S]*?)(<\/h6>)/g, '**$2**').replace(/(<mark>)([\s\S]*?)(<\/mark>)/g, '==$2==').replace(/<br>/g, "\n")
                            }

                            comments.onblur = (e) => {
                                const node = view.contentDOM.querySelector('#' + element.getAttribute('id'))
                                const newText = (e.target as HTMLElement).innerText
                                const { state } = view;
                                const position = view.posAtDOM(node);
                                const line = state.doc.lineAt(position);
                                const Exp = RegExp("(" + element.getAttribute('id') + "'>)([\\s\\S]*?)(<\/span>)", "g")
                                const test = line.text.replace(Exp, '$1' + newText + '$3')

                                // ====================
                                // let setTextStyle = test.replace(/\n/g, "<br>")
                                let setTextStyle = test.replace(/([*]{2})([\s\S]*?)([*]{2})/g, "<h6>$2</h6>").replace(/([=]{2})([\s\S]*?)([=]{2})/g, "<mark>$2</mark>").replace(/\n/g, "<br>")

                                // ====================

                                view.dispatch({ changes: { from: line.from, to: line.to, insert: setTextStyle, } })
                            }

                            // if(update.docChanged){


                            if (comments.offsetHeight + 5 >= element.parentElement.parentElement.parentElement.offsetHeight) {
                                element.parentElement.parentElement.parentElement.setAttribute('style', `min-height:${comments.offsetHeight + 5}px;top:0px`)
                            } else {
                                element.parentElement.parentElement.parentElement.removeAttribute('style')
                            }



                            // }


                        }
                    });

                }

            }



            update(update: ViewUpdate) {
                this.dom.style.minHeight = update.view.contentHeight + 'px';

                // if(update.geometryChanged){
                this.setCommnet(update.view, update)
                // }


                // if (update.geometryChanged) {
                //     console.log('geometryChanged');

                // }

                if (update.docChanged) {
                    dispatchEvent(new CustomEvent("notes-update"));

                }

                // if (update.selectionSet) {
                //     const selectText = update.state.sliceDoc(update.state.selection.main.from, update.state.selection.main.to)
                //     if((selectText.startsWith('<span') && selectText.indexOf('comment-id-')!=-1)){

                //         const sdfsdf = (app as any).plugins.plugins['obsidian-hover-editor'].spawnPopover();
                //         console.log(sdfsdf);
                //     }



                // }




            }

            destroy() {
                this.dom.remove();
            }
        }

    );
}