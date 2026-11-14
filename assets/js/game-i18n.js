/*
 * IELTSX Game -- the words of the player page (/game) and the host screen (/game-host) in Uzbek, English and Russian.
 * The language button (top right) switches them; the choice is kept in this browser.
 */
(function () {
  'use strict';
  var T = {
    uz: {
      pinLabel: 'Oʻyin PIN kodi', pinPh: 'PIN kodni kiriting', enter: 'Kirish', pinBad: '6 xonali PIN kodni kiriting',
      pinWrong: 'Bunday PIN kodli oʻyin yoʻq. Ekrandagi raqamni tekshiring.', tooMany: 'Juda koʻp urinish. Bir necha daqiqadan soʻng qayta urinib koʻring.',
      nickLabel: 'Ismingiz', nickPh: 'Ismingizni yozing', go: 'Boshladik!', nickBad: 'Ismingizni yozing', nickTaken: 'Bu ism band. Boshqa ism tanlang.',
      lockedJoin: 'Boshlovchi oʻyinga kirishni yopib qoʻydi.', full: 'Oʻyin toʻldi.',
      youreIn: 'Siz oʻyindasiz!', seeName: 'Ismingizni ekranda koʻryapsizmi?', waitStart: 'Boshlovchi oʻyinni boshlashini kuting…', leave: 'Chiqish',
      qOf: '{n}-savol · jami {m}', getReady: 'Tayyorlaning…', sent: 'Javob yuborildi!', waitOthers: 'Boshqalarni kutyapmiz…',
      correct: 'Toʻgʻri!', wrong: 'Notoʻgʻri', timeUp: 'Vaqt tugadi', rightWas: 'Toʻgʻri javob:', streak: 'Ketma-ket {n} ta toʻgʻri 🔥',
      score: 'Ball', yourPlace: 'oʻrningiz', ofPlayers: '{n} oʻyinchidan', finalScore: 'Yakuniy ball', playAgain: 'Yana oʻynash', backSite: 'IELTSX ga qaytish',
      gone: 'Bu oʻyin tugadi.', kicked: 'Boshlovchi sizni oʻyindan chiqardi.', offline: 'Aloqa uzildi. Qayta ulanmoqda…',
      double: 'Ikki barobar ball!', noPoints: 'Ballsiz savol', answersN: 'javob', joinAt: 'Telefoningizda oching:', gamePin: 'Oʻyin PIN kodi:',
      playersN: 'oʻyinchi', start: 'Boshlash', next: 'Keyingi', skip: 'Oʻtkazib yuborish', scoreboard: 'Reyting', endGame: 'Oʻyinni tugatish',
      lock: 'Kirishni yopish', unlock: 'Kirishni ochish', waitingPlayers: 'Oʻyinchilarni kutyapmiz…', winner: 'Gʻolib', closeGame: 'Oʻyinni yopish',
      fullscreen: 'Toʻliq ekran', kickHint: 'Oʻyinchini chiqarish uchun ismini bosing', lockedNote: 'Kirish yopiq: yangi oʻyinchi qoʻshila olmaydi',
      nobody: 'Hech kim javob bermadi', hostOnly: 'Boshlovchi ekranini faqat admin ochadi.', signIn: 'Kirish (Sign in)', gameOver: 'Bu oʻyin tugagan yoki yopilgan.',
      toAdmin: 'Admin panelga qaytish', csv: 'Natijalarni yuklab olish (CSV)', allResults: 'Barcha natijalar', points: 'ball',
      answeredOf: '{a} / {p} javob berdi', rightOf: '{p} tadan {a} tasi toʻgʻri javob berdi', removeQ: '{name} oʻyindan chiqarilsinmi?', endQ: 'Oʻyin hozir tugatilsinmi? Natijalar saqlanadi.', closeQ: 'Oʻyin yopilsinmi? Oʻyinchilar oʻyindan chiqadi.',
      needPlayer: 'Kamida bitta oʻyinchi qoʻshilishini kuting.', rank: '#', player: 'Oʻyinchi', right: 'Toʻgʻri', sec: 's',
      title: 'IELTSX Game', tagline: 'Sinf bilan jonli viktorina'
    },
    en: {
      pinLabel: 'Game PIN', pinPh: 'Enter PIN', enter: 'Enter', pinBad: 'Enter the 6-digit PIN',
      pinWrong: 'No game with this PIN. Check the number on the screen.', tooMany: 'Too many tries. Please wait a few minutes.',
      nickLabel: 'Nickname', nickPh: 'Your name', go: 'OK, go!', nickBad: 'Enter a nickname', nickTaken: 'This nickname is taken. Try another one.',
      lockedJoin: 'The host has locked this game.', full: 'This game is full.',
      youreIn: "You're in!", seeName: 'See your nickname on screen?', waitStart: 'Waiting for the host to start…', leave: 'Leave',
      qOf: 'Question {n} of {m}', getReady: 'Get ready…', sent: 'Answer sent!', waitOthers: 'Waiting for the others…',
      correct: 'Correct!', wrong: 'Incorrect', timeUp: "Time's up", rightWas: 'Right answer:', streak: 'Answer streak {n} 🔥',
      score: 'Score', yourPlace: 'your place', ofPlayers: 'of {n} players', finalScore: 'Final score', playAgain: 'Play again', backSite: 'Back to IELTSX',
      gone: 'This game has ended.', kicked: 'The host removed you from this game.', offline: 'Connection lost. Reconnecting…',
      double: 'Double points!', noPoints: 'No points', answersN: 'answers', joinAt: 'Join on your phone at', gamePin: 'Game PIN:',
      playersN: 'players', start: 'Start', next: 'Next', skip: 'Skip', scoreboard: 'Scoreboard', endGame: 'End game',
      lock: 'Lock', unlock: 'Unlock', waitingPlayers: 'Waiting for players…', winner: 'Winner', closeGame: 'Close game',
      fullscreen: 'Full screen', kickHint: 'Click a name to remove the player', lockedNote: 'Locked: nobody new can join',
      nobody: 'Nobody answered', hostOnly: 'Only admins can open the host screen.', signIn: 'Sign in', gameOver: 'This game is over or was closed.',
      toAdmin: 'Back to the admin panel', csv: 'Download results (CSV)', allResults: 'All results', points: 'points',
      answeredOf: '{a} of {p} answered', rightOf: '{a} of {p} got it right', removeQ: 'Remove {name} from the game?', endQ: 'End the game now? The results are kept.', closeQ: 'Close the game? The players leave it.',
      needPlayer: 'Wait until at least one player has joined.', rank: '#', player: 'Player', right: 'Right', sec: 's',
      title: 'IELTSX Game', tagline: 'Live quiz with your class'
    },
    ru: {
      pinLabel: 'PIN-код игры', pinPh: 'Введите PIN', enter: 'Войти', pinBad: 'Введите 6-значный PIN',
      pinWrong: 'Игры с таким PIN нет. Проверьте число на экране.', tooMany: 'Слишком много попыток. Подождите несколько минут.',
      nickLabel: 'Никнейм', nickPh: 'Ваше имя', go: 'Поехали!', nickBad: 'Введите никнейм', nickTaken: 'Это имя уже занято. Выберите другое.',
      lockedJoin: 'Ведущий закрыл вход в игру.', full: 'Игра заполнена.',
      youreIn: 'Вы в игре!', seeName: 'Видите своё имя на экране?', waitStart: 'Ждём, когда ведущий начнёт…', leave: 'Выйти',
      qOf: 'Вопрос {n} из {m}', getReady: 'Приготовьтесь…', sent: 'Ответ отправлен!', waitOthers: 'Ждём остальных…',
      correct: 'Верно!', wrong: 'Неверно', timeUp: 'Время вышло', rightWas: 'Правильный ответ:', streak: 'Серия верных ответов: {n} 🔥',
      score: 'Очки', yourPlace: 'ваше место', ofPlayers: 'из {n} игроков', finalScore: 'Итоговый счёт', playAgain: 'Играть снова', backSite: 'Назад в IELTSX',
      gone: 'Эта игра завершена.', kicked: 'Ведущий удалил вас из игры.', offline: 'Нет связи. Переподключаемся…',
      double: 'Двойные очки!', noPoints: 'Без очков', answersN: 'ответов', joinAt: 'Откройте на телефоне', gamePin: 'PIN-код игры:',
      playersN: 'игроков', start: 'Начать', next: 'Далее', skip: 'Пропустить', scoreboard: 'Таблица лидеров', endGame: 'Завершить игру',
      lock: 'Закрыть вход', unlock: 'Открыть вход', waitingPlayers: 'Ждём игроков…', winner: 'Победитель', closeGame: 'Закрыть игру',
      fullscreen: 'Во весь экран', kickHint: 'Нажмите на имя, чтобы удалить игрока', lockedNote: 'Вход закрыт: новые игроки не могут войти',
      nobody: 'Никто не ответил', hostOnly: 'Экран ведущего открывает только админ.', signIn: 'Войти', gameOver: 'Игра завершена или закрыта.',
      toAdmin: 'Назад в админ-панель', csv: 'Скачать результаты (CSV)', allResults: 'Все результаты', points: 'очков',
      answeredOf: 'ответили {a} из {p}', rightOf: 'верно ответили {a} из {p}', removeQ: 'Удалить {name} из игры?', endQ: 'Завершить игру сейчас? Результаты сохранятся.', closeQ: 'Закрыть игру? Игроки выйдут из неё.',
      needPlayer: 'Дождитесь хотя бы одного игрока.', rank: '#', player: 'Игрок', right: 'Верно', sec: 'с',
      title: 'IELTSX Game', tagline: 'Живая викторина с классом'
    }
  };
  var LANGS = ['uz', 'en', 'ru'];
  var lang = 'uz';
  try { var saved = localStorage.getItem('ix-game-lang'); if (LANGS.indexOf(saved) >= 0) lang = saved;   /* Uzbek first; the button switches */ } catch (e) { /* storage blocked */ }

  function t(key, vars) {
    var s = (T[lang] && T[lang][key]) || T.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(String(vars[k])); });
    return s;
  }
  function apply(root) {
    (root || document).querySelectorAll('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')); });
    (root || document).querySelectorAll('[data-t-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-t-ph'))); });
    document.documentElement.lang = lang;
    var b = document.getElementById('lang-btn'); if (b) b.lastChild.textContent = ' ' + lang.toUpperCase();
  }
  function next() {
    lang = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];
    try { localStorage.setItem('ix-game-lang', lang); } catch (e) { /* storage blocked */ }
    apply(); document.dispatchEvent(new CustomEvent('ix-lang'));
  }
  window.IXGameI18n = { t: t, apply: apply, next: next, get lang() { return lang; } };
})();
