<template>
    <div v-for="item in viewComments">
        <div class="view-comments-gx" @click="handler(item.id)">
            <span v-html='item.innerHTML'></span>
        </div>
    </div>
</template>

<script setup lang="tsx">
import { EditorView } from 'codemirror';
import MyPlugin from 'src/main';
import { getCurrentInstance, onMounted, onUnmounted, reactive } from 'vue';



let compomentSelf = getCurrentInstance();
let plugin = compomentSelf.appContext.config.globalProperties.plugin as MyPlugin;
let container = compomentSelf.appContext.config.globalProperties.container as HTMLElement;
let viewComments = reactive([])



function handler(id: string) {

    const view = plugin.current_note

    // @ts-expect-error, not typed
    const editorView = view.editor.cm as EditorView;
    const doc = editorView.state.doc.children
    doc.forEach((value, index) => {
        let tNumber = 0
        for (let i = 1; i <= value.lines; i++) {
            if (value.line(i).text.indexOf(id) != -1) {
                tNumber = index * 32 + value.line(i).number 
                view.editor.focus()
                view.editor.setCursor(tNumber-2,2)       
                console.log(tNumber);
                
                return 0
            }
        }
    })
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
    border: 1px solid #cdcdcd;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 12px;
}
</style>