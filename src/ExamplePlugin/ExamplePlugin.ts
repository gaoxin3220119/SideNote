import {
  ViewUpdate,
  PluginValue,
  EditorView,
  ViewPlugin,
} from "@codemirror/view";

import { Facet} from '@codemirror/state';




class ExamplePlugin  {


	dom: HTMLElement;
	fixed: boolean;
	prevViewport: { from: number, to: number };

  constructor(view: EditorView) {
   
    this.prevViewport = view.viewport;
    this.dom = document.createElement('div');
    this.dom.className = 'cm-gutters';
    this.dom.setAttribute('style', 'background-color:rgb(246, 248, 250);width:150px');
    this.dom.setAttribute("id", "right-gutters")
    this.dom.style.minHeight = view.contentHeight + 'px'; 
    

    
    view.scrollDOM.insertBefore(this.dom, view.contentDOM.nextSibling);
  }


  setCommnet(view: EditorView) {
  

    const _get_gutter = view.dom.querySelector('#right-gutters')
    if (_get_gutter) {

        _get_gutter.empty()

        const findComment = view.contentDOM.querySelectorAll(".comment")
        
        
        let temp=0;

        findComment.forEach(element => {
            if (element) {
               
                const comments = document.createElement('div')
                comments.style.top = element.parentElement.parentElement.parentElement.offsetTop + temp + 'px'
                comments.style.position = 'absolute'
                comments.style.zIndex = '99'
                comments.style.whiteSpace = 'pre-wrap'
                comments.style.color = '#000'
                comments.addClass('rightComments')
                comments.setText(element.innerHTML)
                _get_gutter.append(comments)
                temp = 0

                element.parentElement.parentElement.parentElement.style.height = comments.offsetHeight + 5 + 'px'

                // console.log(temp,comments.offsetHeight);
                
            }
        });


    }

}

  update(update: ViewUpdate) {
    // ...
    // console.log(update);

    this.dom.style.minHeight = update.view.contentHeight + 'px'; 

    this.setCommnet(update.view)
  }

  destroy() {
    // ...
    
		this.dom.remove();
  }
}

export const examplePlugin = ViewPlugin.fromClass(ExamplePlugin);