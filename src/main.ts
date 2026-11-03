import './style.css';
import { quickScreen } from './ui/screens/quick';
import { broadcastCss } from './ui/broadcast';
import { renderSettings } from './ui/screens/settings';
import { initRouter, register, go } from './ui/router';
import { menuScreen } from './ui/screens/menu';
import { newGameScreen } from './ui/screens/newGame';
import { homeScreen } from './ui/screens/home';

initRouter(document.getElementById('app')!);
register('menu', menuScreen);
register('quick', quickScreen);
register('newGame', newGameScreen);
register('home', homeScreen);
go('menu');

const css = document.createElement('style');
css.textContent = broadcastCss;
document.head.append(css);
void renderSettings;
