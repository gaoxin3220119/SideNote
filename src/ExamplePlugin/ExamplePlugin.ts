import {
  ViewUpdate,
  PluginValue,
  EditorView,
  ViewPlugin,
  WidgetType,
  Decoration
} from "@codemirror/view";

import { Facet } from '@codemirror/state';
import { Notice } from "obsidian";
import { ExampleModal } from "src/Dialog/dialog";
import * as CodeMirror from "codemirror";
import * as codemirror from "codemirror";




class ExamplePlugin implements PluginValue {


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




  setCommnet(view: EditorView, update: ViewUpdate) {


    const _get_gutter = view.dom.querySelector('#right-gutters')
    if (_get_gutter) {

      _get_gutter.empty()

      const findComment = view.contentDOM.querySelectorAll(".comment")



      findComment.forEach(element => {
        if (element) {

          // console.log(element);


          const comments = document.createElement('div')
          comments.style.top = element.parentElement.parentElement.parentElement.offsetTop + 'px'
          comments.style.position = 'absolute'
          comments.style.zIndex = '99'
          comments.addClass('rightComments')
          comments.setAttribute('contenteditable', 'true')

          comments.innerHTML = element.innerHTML
          _get_gutter.append(comments)

          const editor = document.querySelector(".editor");


          comments.onblur = (e)=>{

            const node = view.contentDOM.querySelector('#' + element.getAttribute('id'))

            const newText = (e.target as HTMLElement).innerHTML
        
            const { state } = view;

            const position = view.posAtDOM(node);

            const line = state.doc.lineAt(position);

            const Exp = RegExp( "(" +  element.getAttribute('id')+"'>)([\\s\\S]*?)(<\/span>)","g")

            const test = line.text.replace(Exp,'$1' +newText +'$3' )



            view.dispatch({
              changes: {
                    from: line.from,
                    to: line.to,
                    insert: test,
                  },
            })
          }



          // comments.addEventListener('change', (e) => {


          //   const node = view.contentDOM.querySelector('#' + element.getAttribute('id'))

          //   const newText = (e.target as HTMLElement).innerHTML
        
          //   const { state } = view;

          //   const position = view.posAtDOM(node);

          //   const line = state.doc.lineAt(position);

          //   const Exp = RegExp( "(" +  element.getAttribute('id')+"'>)([\\s\\S]*?)(<\/span>)","g")

          //   const test = line.text.replace(Exp,'$1' +newText +'$3' )



          //   view.dispatch({
          //     changes: {
          //           from: line.from,
          //           to: line.to,
          //           insert: test,
          //         },
          //   })

            // const transaction = state.update({
            //   changes: {
            //     from: line.from,
            //     to: line.to,
            //     insert: test,
            //   },
            // });

            // if(transaction.startState){
            //   view.dispatch(transaction);
            // }
            


          // })





          // if (element.parentElement.parentElement.parentElement.offsetHeight < comments.offsetHeight){
          //   element.parentElement.parentElement.parentElement.style.height = comments.offsetHeight + 5 + 'px'
          // }
          // element.parentElement.parentElement.parentElement.style.height = comments.offsetHeight + 5 + 'px'

          // console.log(temp,comments.offsetHeight);

        }
      });


    }

  }

  update(update: ViewUpdate) {
    // ...
    // console.log(update);

    this.dom.style.minHeight = update.view.contentHeight + 'px';

    this.setCommnet(update.view, update)



  }

  destroy() {
    // ...

    this.dom.remove();
  }
}

export const examplePlugin = ViewPlugin.fromClass(ExamplePlugin);