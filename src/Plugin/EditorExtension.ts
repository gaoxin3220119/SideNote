import {
    ViewUpdate,
    PluginValue,
    EditorView,
    ViewPlugin,
} from "@codemirror/view";
import { App, MarkdownView, WorkspaceLeaf, setIcon } from "obsidian";
import MyPlugin from "src/main";


const label = "View notes";

const addSrcButton = (app: App,plugin: MyPlugin) => {
    const apply = () => app.workspace.iterateAllLeaves(addButton(app,plugin));

    app.workspace.onLayoutReady(apply);
    app.workspace.on("layout-change", apply);
};


const addButton = (app: App,plugin: MyPlugin) => (leaf: WorkspaceLeaf) => {
    if (
        leaf.view instanceof MarkdownView &&
        leaf.view.containerEl.querySelector(
            `a.view-action[aria-label="${label}"]`,
        ) === null
    ) {
        let view = leaf.view;
        let isWork = false
        const buttonElement = view.addAction("pdf-file", label, (evt) => {

            const rightGutters = view.contentEl.querySelector('#right-gutters')

            if (isWork) {
                isWork = false
                rightGutters.setAttribute('style', 'display:block')
                rightGutters.setAttribute('style', `background-color:${plugin.settings.backgroundColor}!important;width:${plugin.settings.width}px;margin-right: 30px`);
                setIcon(buttonElement, 'pdf-file');
            } else {
                isWork = true
                rightGutters.setAttribute('style', 'display:none')
                setIcon(buttonElement, 'add-note-glyph');

            }

        });
    }
};

export default function EditingViewPlugin(app: App,plugin: MyPlugin) {
    

    return ViewPlugin.fromClass(
        class ExamplePlugin implements PluginValue {


            dom: HTMLElement;
            fixed: boolean;
            prevViewport: { from: number, to: number };

            constructor(view: EditorView) {
                this.prevViewport = view.viewport;
                this.dom = document.createElement('div');
                this.dom.className = 'cm-gutters';
                this.dom.setAttribute('style', `background-color:${plugin.settings.backgroundColor}!important;width:${plugin.settings.width}px;margin-right: 30px`);
                this.dom.setAttribute("id", "right-gutters")
                this.dom.style.minHeight = view.contentHeight + 'px';
                view.scrollDOM.insertAfter(this.dom, view.contentDOM.nextSibling);
                addSrcButton(app,plugin)
            }


            setCommnet(view: EditorView,update:ViewUpdate) {
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
                            comments.style.top = element.parentElement.parentElement.parentElement.offsetTop + 'px'
                            comments.addClass('rightComments')
                            comments.innerHTML = element.innerHTML
                            _get_gutter.append(comments)

                            comments.onclick = (e) => {
                                comments.setAttribute('contenteditable', 'plaintext-only')
                                comments.style.cursor = 'text'
                                comments.style.border = '1px solid #00f'
                            }

                            comments.onblur = (e) => {
                                const node = view.contentDOM.querySelector('#' + element.getAttribute('id'))
                                const newText = (e.target as HTMLElement).innerText
                                const { state } = view;
                                const position = view.posAtDOM(node);
                                const line = state.doc.lineAt(position);
                                const Exp = RegExp("(" + element.getAttribute('id') + "'>)([\\s\\S]*?)(<\/span>)", "g")
                                const test = line.text.replace(Exp, '$1' + newText + '$3')
                                view.dispatch({ changes: { from: line.from, to: line.to, insert: test.replace(/\n/g, "<br>"), } })
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
                    this.setCommnet(update.view,update)
                // }

           
                

                if(update.docChanged){
                    dispatchEvent(new CustomEvent("notes-update"));
                    
                }
                

                                
            }

            destroy() {
                this.dom.remove();
            }
        }

    );
}