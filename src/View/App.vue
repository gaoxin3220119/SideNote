<template>
    <div class="tool-bar nav-buttons-container">
        <div ref="outputFile" class="tool-bar-item clickable-icon nav-action-button" title="output to md file"
            @click="outPutFile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-file-output">
                <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M2 15h10" />
                <path d="m5 12-3 3 3 3" />
            </svg>
        </div>
    </div>
    <div v-for="(item, index)  in viewComments">
        <div class="header-tool">
            <div class="copy-icons" @click="copyHandler(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-copy">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
            </div>
        </div>
        <div class="view-comments-gx" @click="handler(item.id)">
            <span class="view-comments-gx-span" v-html='item.innerHTML' :ref="'menuItem' + index"></span>
        </div>
    </div>
</template>

<style>
.view-comments-gx-span h5 {
    display: inline;
}
</style>

<style scoped>
.tool-bar {
    width: 100%;
    height: 32px;
    /* background: #e2e2e2!important; */
    margin-bottom: 5px;
}

/* .tool-bar .tool-bar-item{
    width: 100%;
} */
.view-comments-gx {
    width: 100%;
    padding: 10px;
    background: var(--background-primary);
    margin-bottom: 5px;
    cursor: pointer;
    border-bottom: 1px solid var(--divider-color);
    border-right: 1px solid var(--divider-color);
    border-left: 1px solid var(--divider-color);
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 12px;
}



.header-tool {
    height: 25px;
    background: var(--background-primary);
    border-top: 1px solid var(--divider-color);
    border-right: 1px solid var(--divider-color);
    border-left: 1px solid var(--divider-color);
    position: relative;
}

.copy-icons {
    position: absolute; 
    right: 4px;
    top:2px;
    cursor: pointer;
}
</style>

<script setup lang="tsx">
import { EditorView } from 'codemirror';
import { HeadingCache, Notice } from 'obsidian';
import { ConfirmModal } from 'src/Dialog/confirm';
import MyPlugin from 'src/main';
import { getCurrentInstance, onMounted, onUnmounted, reactive } from 'vue';



let compomentSelf = getCurrentInstance();
let plugin = compomentSelf.appContext.config.globalProperties.plugin as MyPlugin;
let container = compomentSelf.appContext.config.globalProperties.container as HTMLElement;
let viewComments = reactive([])
let outputCommnets: string[] = []

async function outPutFile() {

    if (outputCommnets.length <= 0) {
        new Notice('内容为空！')
        return
    }

    const value: string[] = []


    outputCommnets.forEach((line) => {
        const s = line.replace(/(<b>)([\s\S]*?)(<\/b>)/g, '**$2**').replace(/(<mark>)([\s\S]*?)(<\/mark>)/g, '==$2==').replace(/<br>/g, "\n")
        value.push(s + '\n\n---\n\n')
    })


    const templatesFolder = plugin.settings.templatesFolder



    let fileStr: string

    if (templatesFolder.trim().length == 0) {

        fileStr = `【Note】${plugin.current_note.file.name.replace(".md", "")}.md`

    } else {

        fileStr = `${templatesFolder}\/【Note】${plugin.current_note.file.name.replace(".md", "")}.md`
    }

    const file = plugin.app.vault.getAbstractFileByPath(fileStr)


    if (file) {
        new ConfirmModal(plugin.app, async (adf) => {
            await plugin.app.vault.delete(file, true)
            await plugin.app.vault.create(fileStr, value.join(""))
        }).open()
    } else {
        try {
            await plugin.app.vault.create(fileStr, value.join(""))
        }catch(err){
            new Notice('笔记导出目录不存在，请检查笔记目录设置。')
        }
    }




}


function textCopy(t: string) {
    // 如果当前浏览器版本不兼容navigator.clipboard
    if (!navigator.clipboard) {
        let ele = document.createElement("input");
        ele.value = t;
        document.body.appendChild(ele);
        ele.select();
        document.execCommand("copy");
        document.body.removeChild(ele);
        if (document.execCommand("copy")) {
            new Notice('复制成功！')
        } else {
            new Notice('复制失败！')
        }
    } else {
        navigator.clipboard.writeText(t).then(function () {
            new Notice('复制成功！')
        }).catch(function () {
            new Notice('复制失败！')
        })
    }
}

const { proxy } = getCurrentInstance();

function copyHandler(index: number) {

    const text = proxy.$refs[`menuItem${index}`] as HTMLSpanElement

    // @ts-expect-error, not typed
    textCopy(text[0].innerHTML)



}

function handler(id: string) {

    const view = plugin.current_note

    // @ts-expect-error, not typed
    const editorView = view.editor.cm as EditorView;
    const doc = editorView.state.doc.children

    if (doc) {
        doc.forEach((value, index) => {
            let tNumber = 0
            for (let i = 1; i <= value.lines; i++) {
                if (value.line(i).text.indexOf(id) != -1) {
                    tNumber = index * 32 + value.line(i).number
                    view.editor.focus()
                    view.editor.setCursor(tNumber - 2, 1)
                    const cursor = view.editor.getCursor()
                    const pos = view.editor.posToOffset(cursor);
                    const word = editorView.lineBlockAt(pos);




                    if (word) {
                        const wordStart = view.editor.offsetToPos(word.from);
                        const wordEnd = view.editor.offsetToPos(word.to);
                        view.editor.scrollIntoView({ from: wordStart, to: wordEnd }, true)
                        //view.editor.setSelection(  wordStart ,wordEnd) 选中整行


                        // const line = cursor.line
                        // view.setEphemeralState({ line });
                        // setTimeout(() => { view.setEphemeralState({ line }); }, 100);


                    }



                    return 0
                }
            }
        })
    } else {

        const loneDoc = editorView.state.doc
        let tNumber = 0
        for (let i = 1; i <= loneDoc.lines; i++) {
            if (loneDoc.line(i).text.indexOf(id) != -1) {
                tNumber = loneDoc.line(i).number
                view.editor.focus()
                view.editor.setCursor(tNumber - 1, 1)
                return 0
            }
        }

    }


}




onMounted(() => {
    changed()
    addEventListener("notes-update", reset, false);
    plugin.app.workspace.on("active-leaf-change", leafChange);



});

onUnmounted(() => {
    removeEventListener("notes-update", reset);
});


function stringToHTML(str: string) {
    let dom = document.createElement('div');
    dom.innerHTML = str;
    return dom;
};


function leafChange() {
    changed()
}


function reset(e: Event) {
    changed()
}

function changed() {
    viewComments.length = 0
    outputCommnets.length = 0
    const view = plugin.current_note
    if (view) {
        const Exp = RegExp("(<span\\s+class=\"comment\"\\s+style=\"display:none;\"\\s+id='comment-id-.*?>)([\\s\\S]*?)(</span>)", "g")
        const findComment = view.getViewData().match(Exp)
        if (findComment) {
            findComment.forEach((item) => {
                const id = stringToHTML(item).children[0].id
                const innerHTML = stringToHTML(item).children[0].innerHTML
                outputCommnets.push(innerHTML)
                viewComments.push({ id, innerHTML });

            })
        }
    }
}



</script>

