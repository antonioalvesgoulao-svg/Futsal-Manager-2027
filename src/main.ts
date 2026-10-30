import './style.css';
import { initRouter, register, go } from './ui/router';
import { menuScreen } from './ui/screens/menu';
import { newGameScreen } from './ui/screens/newGame';
import { homeScreen } from './ui/screens/home';

initRouter(document.getElementById('app')!);
register('menu', menuScreen);
register('newGame', newGameScreen);
register('home', homeScreen);
go('menu');
