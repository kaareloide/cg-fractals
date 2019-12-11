## Demo site

https://k44rel.github.io/cg-fractals/

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
