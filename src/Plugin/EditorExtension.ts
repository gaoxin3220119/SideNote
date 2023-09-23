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

            // drawLine(startObj: HTMLElement, endObj: HTMLElement): HTMLElement {

            //     //起点元素中心坐标
            //     var y_start = startObj.offsetTop
            //     var x_start = startObj.offsetLeft;

            //     //终点元素中心坐标
            //     var y_end = endObj.offsetTop;
            //     var x_end = endObj.offsetLeft;

            //     //用勾股定律计算出斜边长度及其夹角（即连线的旋转角度）
            //     var lx = x_end - x_start;
            //     var ly = y_end - y_start;
            //     //计算连线长度
            //     var length = Math.sqrt(lx * lx + ly * ly);
            //     //弧度值转换为角度值
            //     var c = 360 * Math.atan2(ly, lx) / (2 * Math.PI);

            //     //连线中心坐标
            //     var midX = (x_end + x_start) / 2;
            //     var midY = (y_end + y_start) / 2
            //     var deg = c <= -90 ? (360 + c) : c;  //负角转换为正角




            //     const html = document.createElement('div')
            //     html.addClass('line')
            //     html.setAttribute('style', `top:${midY}px;left:${midX - length / 2}px;width:${length}px;transform:rotate(${deg}deg);`)

            //     return html;
            // }



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


                    let tempComment: HTMLElement = document.createElement('div')
                    // let arrayComment: HTMLDivElement[] =[]
                    let baseTop = ''
                    let moreCommentHeight = 0

                    findComment.forEach(element => {
                        if (element) {


                            const comments = document.createElement('div')
                            comments.style.top = element.parentElement.parentElement.parentElement.offsetTop - 30 + 'px'
                            comments.style.backgroundColor = plugin.settings.commentItmebackgroundColor
                            comments.style.color = plugin.settings.commentItmeColor
                            comments.style.fontSize = plugin.settings.commentItmefontSize
                            comments.innerHTML = element.innerHTML
                            comments.addClass('rightComments')
                            _get_gutter.append(comments)


                            if (comments.style.top == tempComment.style.top || comments.style.top == baseTop) {
                                baseTop = comments.style.top
                                moreCommentHeight = moreCommentHeight + tempComment.offsetHeight
                                comments.style.top = tempComment.offsetTop + tempComment.offsetHeight + 1 + "px"
                            } else {
                                moreCommentHeight = comments.offsetHeight
                            }

                            tempComment = comments


                            if (moreCommentHeight + 5 >= element.parentElement.parentElement.parentElement.offsetHeight) {
                                element.parentElement.parentElement.parentElement.setAttribute('style', `min-height:${moreCommentHeight + 5}px;top:0px`)
                            } else {
                                element.parentElement.parentElement.parentElement.removeAttribute('style')
                            }

                            comments.onclick = (e) => {
                                // view.scrollDOM.append(this.drawLine(e.targetNode as HTMLElement, element as HTMLElement))
                            }


                            comments.ondblclick = (e) => {
                                comments.setAttribute('contenteditable', 'plaintext-only')
                                comments.style.cursor = 'text'
                                comments.style.border = '1px solid #00f'
                                comments.innerHTML = comments.innerHTML.replace(/(<h5>)([\s\S]*?)(<\/h5>)/g, '**$2**').replace(/(<mark>)([\s\S]*?)(<\/mark>)/g, '==$2==').replace(/<br>/g, "\n")
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

                                let setTextStyle = test.replace(/([*]{2})([\s\S]*?)([*]{2})/g, "<h5>$2</h5>").replace(/([=]{2})([\s\S]*?)([=]{2})/g, "<mark>$2</mark>").replace(/\n/g, "<br>")

                                // ====================

                                view.dispatch({ changes: { from: line.from, to: line.to, insert: setTextStyle, } })
                            }





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