<template>
    <div v-for="item in findComment">
        {{ item.innerHTML }}
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

console.log(plugin.current_note);




onMounted(() => {
    addEventListener("notes-update", reset);

    // plugin.app.workspace.on("active-leaf-change", reset);
});

onUnmounted(() => {
    removeEventListener("notes-update", reset);
});



function reset() {
    const view = plugin.current_note



    findComment.value = view.containerEl.querySelectorAll('.comment')

  
   

    console.log("");
    

}




</script>


<style scoped>
h2 {
    color: lightcoral;
}
</style>