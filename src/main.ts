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

const btn$ = Observable.fromEvent<MouseEvent>($btnGroup, 'click')
  .map(evt => ({
    type: (evt.target['className'].match(/button-(\S+)/) || [, null])[1],
    value: <string>$input.value,
    item: null
  }))
  .filter(action => action.type !== null);

const item$ = Observable.fromEvent<MouseEvent>($list, 'click')
  .filter((evt) => evt.target['classList'].contains('queue-item'))
  .map((evt) => ({
    type: 'delete',
    value: null,
    item: <HTMLLIElement>evt.target
  }));

btn$.merge(item$)
  .do(action => {
    switch (action.type) {
      case 'left-in':
        $list.insertBefore(createItem(action.value), $list.firstElementChild);
        break;
      case 'left-out':
        if ($list.firstElementChild) {
          alert($list.firstElementChild.innerHTML)
          $list.removeChild($list.firstElementChild);
        }
        break;
      case 'right-in':
        $list.appendChild(createItem(action.value));
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
    $input.value = random();
  })
  .subscribe(
    (e) => console.log(e),
    (e) => console.error(e)
  );