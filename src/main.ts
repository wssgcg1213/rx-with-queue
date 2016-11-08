// style
import 'bootstrap.min.css'
import './style.css'
import { Observable } from 'rxjs'

const $ = document.querySelector.bind(document);
const $btnGroup = <HTMLDivElement>$('#btn-group');
const $list = <HTMLUListElement>$('.list-group');
const $input = <HTMLInputElement>$('.queue-input');

const createItem = (text: string) => {
  const li = <HTMLLIElement>document.createElement('li');
  li.classList.add('queue-item');
  li.innerHTML = text;
  return li;
}

const random = ():string => {
  return String(Math.floor(Math.random() * 100));
}

$input.value = random()

interface Action {
  type: string;
  value?: string;
  item?: HTMLElement;
}
function createAction(type, value = null, item = null):Action {
  return {
    type,
    value,
    item
  }
}

const btn$ = Observable.fromEvent<MouseEvent>($btnGroup, 'click')
  .map((evt) => createAction(
    (evt.target['className'].match(/button-(\S+)/) || [, null])[1],
    $input.value
  ))
  .filter(action => action.type !== null);

const item$ = Observable.fromEvent<MouseEvent>($list, 'click')
  .filter((evt) => evt.target['classList'].contains('queue-item'))
  .map((evt) => createAction('delete', null, evt.target));

const app$ = btn$.merge(item$)
  .do((action: Action) => {
    // 带副作用操作
    switch (action.type) {
      case 'left-in':
        $list.insertBefore(createItem(action.value), $list.firstElementChild);
        $input.value = random();
        break;
      case 'left-out':
        if ($list.firstElementChild) {
          alert($list.firstElementChild.innerHTML)
          $list.removeChild($list.firstElementChild);
        }
        break;
      case 'right-in':
        $list.appendChild(createItem(action.value));
        $input.value = random();
        break;
      case 'right-out':
        if ($list.lastElementChild) {
          alert($list.lastElementChild.innerHTML)
          $list.removeChild($list.lastElementChild);
        }
        break;
      case 'delete':
        $list.removeChild(action.item)
    }
  })
  .subscribe(
    (action) => console.log(action),
    (err) => console.error(err)
  );