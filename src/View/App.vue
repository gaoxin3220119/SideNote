<template>
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
            <span v-html='item.innerHTML' :ref="'menuItem' + index"></span>
        </div>
    </div>
</template>

<script setup lang="tsx">
import { EditorView } from 'codemirror';
import { Notice } from 'obsidian';
import MyPlugin from 'src/main';
import { getCurrentInstance, onMounted, onUnmounted, reactive } from 'vue';



let compomentSelf = getCurrentInstance();
let plugin = compomentSelf.appContext.config.globalProperties.plugin as MyPlugin;
let container = compomentSelf.appContext.config.globalProperties.container as HTMLElement;
let viewComments = reactive([])


function textCopy(t) {
    // 如果当前浏览器版本不兼容navigator.clipboard
    if (!navigator.clipboard) {
        var ele = document.createElement("input");
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
    var dom = document.createElement('div');
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
    const view = plugin.current_note
    if (view) {
        const Exp = RegExp("(<span\\s+class=\"comment\"\\s+style=\"display:none;\"\\s+id='comment-id-.*?>)([\\s\\S]*?)(</span>)", "g")
        const findComment = view.getViewData().match(Exp)
        if (findComment) {
            findComment.forEach((item) => {
                const id = stringToHTML(item).children[0].id
                const innerHTML = stringToHTML(item).children[0].innerHTML
                viewComments.push({ id, innerHTML });

            })
        }
    }
}



</script>


<style scoped>
.view-comments-gx {
    width: 100%;
    padding: 10px;
    background: #eee;
    margin-bottom: 5px;
    cursor: pointer;
    border-bottom: 1px solid #cdcdcd;
    border-right: 1px solid #cdcdcd;
    border-left: 1px solid #cdcdcd;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 12px;
}

.header-tool {
    height: 20px;
    background: #e2e2e2;
    border-top: 1px solid #cdcdcd;
    border-right: 1px solid #cdcdcd;
    border-left: 1px solid #cdcdcd;
    position: relative;
}

.copy-icons {
    position: absolute;
    right: 2px;
    cursor: pointer;
    
}</style>