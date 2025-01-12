/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { App } from '@/feats/app'
import { PRODUCTION_ENV } from '@/feats/settings'

const root:HTMLElement = document.getElementById('root')!

if( ! PRODUCTION_ENV ){
  //sessionStorage.clear()
}

render( () => <App />, root )
