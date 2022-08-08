Project info https://courses.cs.ut.ee/2019/cg/fall/Main/Project-BeautifulFractalImageGenerator

## Demo site

https://kaareloide.github.io/cg-fractals/

Controls:
 * Keyboard keys "1", "2", "3", "4" to switch between scenes.
 * Mouse to zoom in and move around.

## Requirements

[Node.js](https://nodejs.org/en/) 

## Development

### First time running

Install dependencies
```bash
$ npm install
```

Start development server
```bash
$ npm run start
```
### Otherwise

Start development server
```bash
$ npm run start
```

## Publishing to gh-pages
before first time using this method this should be run
```bash
$ git worktree add dist gh-pages
```

```bash
$ npm run build
$ cd dist
$ git add .
$ git commit -am "commit message"
$ git push origin gh-pages
```
