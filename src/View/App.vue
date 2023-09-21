<template>
    <div v-for="item in findComment">
        {{ item }}
    </div>
</template>

<script setup lang="tsx">
import MyPlugin from 'src/main';
import { ComputedRef, computed, getCurrentInstance, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
import { MyView } from './view';
import { MarkdownView, debounce } from 'obsidian';


let compomentSelf = getCurrentInstance();
let plugin = compomentSelf.appContext.config.globalProperties.plugin as MyPlugin;
let container = compomentSelf.appContext.config.globalProperties.container as HTMLElement;
// let findComment : NodeListOf<Element>

let findComment = ref()






onMounted(() => {
    addEventListener("notes-update", reset);

    // plugin.app.workspace.on("active-leaf-change", reset);
});

onUnmounted(() => {
    removeEventListener("notes-update", reset);
});



function reset() {
    const view = plugin.current_note
    const Exp = RegExp("(id='comment-id-.*'>)([\\s\\S]*?)(</span>)", "g")


    findComment.value = view.getViewData().match(Exp)


    const test = view.getViewData().match(Exp)

    
    

    test.forEach((item)=>{
        
        console.log("item:",item);
    })


    
    

}




</script>


<style scoped>
h2 {
    color: lightcoral;
}
</style>