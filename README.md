# node-xargs
The implement of xargs, written in nodejs

### example:

input:
```bash
echo aaa bbb ccc ddd eee | ts-node src/index.ts -p 2 -n 2 ech
```

output:
```
aaa bbb
ccc ddd
eee
```

### test:
```
npm run test
```

### Consumption time:

```
4~5h
```

### Todo:

The implement of '-P'
