<template>
    <div v-for="item in viewComments">
        <div class="view-comments" @click="handler" :id="item.id">
            {{ item.innerHTML }}
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






function handler(e: Event) {

    

    const id = (e.target as HTMLElement).id

    

    const view = plugin.current_note

    // @ts-expect-error, not typed
    const editorView = view.editor.cm as EditorView;

    const findNode = editorView.dom.querySelector('#' + id)

    const position = editorView.posAtDOM(findNode);

    // const { state } = editorView;

    // const line = state.doc.lineAt(position);

    const ss = editorView.lineBlockAt(position)
    
    //  view.editor.scrollTo(0,)


    console.log(ss);
    


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
.view-comments {
    width: 100%;
    padding: 5px;
}
</style>