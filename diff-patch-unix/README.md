# diff-patch-unix

diff-patch is a nodeJs command-line tool used in order to :

- diff: create file `v1tov2.patch`  based on diff between `v1.ext` and `v2.ext` files

## diff

### Usage
```
$> node diff.js [file1] [file2]
```

it will print the unified diff to stdout.


### Basic example:

To create patch file based on diff between `v1.json` and `v2.json`, just run :

```
$> node diff.js v1.json v2.json > v1tov2.patch
```

this will create `v1tov2.patch` .