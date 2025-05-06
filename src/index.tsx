/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { App } from '@/feats/app'
import { SETTINGS } from '@/feats/settings'

const root:HTMLElement = document.getElementById('root')!
const html:HTMLElement = document.getElementsByTagName('html')[ 0 ]!

html.setAttribute( 'class', 'font-mono bg-slate-900 text-white' )
html.setAttribute( 'spellcheck', 'false' )

if( ! SETTINGS.PRODUCTION_ENV ){
  sessionStorage.clear()
}

render( () => <App />, root )
