import {EMPTY, fromEvent} from 'rxjs'
import {map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap, catchError, filter} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'
const url = 'https://api.github.com/search/users?q='

const search = document.getElementById('search')
const result = document.getElementById('result')

    const stream$ = fromEvent(search, 'input')
        .pipe(
            map(elem => elem.target.value),
            debounceTime(1000),
            distinctUntilChanged(),
            tap(() => result.innerHTML = ''),
            filter(value => value.trim()),
            switchMap(value => ajax.getJSON(url + value).pipe(
                catchError(error => EMPTY)
            )), //takes higher value
            map(response => response.items),
            mergeMap(items => items)
        )

    stream$.subscribe(user => {
        console.log(user)
        const html = ` <div class="card">
                <div class="card-image">
                    <img src="${user.avatar_url}">
                    <span class="card-title">${user.login}</span>
                </div>
                <div class="card-action">
                    <a href="${user.html_url}" target="_blank">Open GitHub</a>
                </div>
            </div>
    `
        result.insertAdjacentHTML('beforeend', html)
    })

