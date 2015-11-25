# diff-patch

diff-patch is a nodeJs command-line tool used in order to :

- diff: create file `v1tov2.patch`  based on diff between `v1.ext` and `v2.ext` files
- patch: apply patch to source file and write result to `source.patched.ext` file

## diff

### Usage
```
$> node diff.js [option] [file1] [file2]
```

### Help
Run :
```
$> node diff.js --help
```

it will print the following :

```
NAME:
   diff - compare two strings
OPTIONS:
-u
   create unified patch file
-c
   diff by char
-j
   diff by json
-l
   diff by line
-w
   diff by word
```

### Basic example:

To create patch file based on diff between `v1.json` and `v2.json`, just run :

```
$> node diff.js -u v1.json v2.json
```

this will create `v1tov2.patch` .

## patch

### Usage
```
$> node patch.js [source] [patch]
```

### Basic example:

To apply `patch` to `source` file and write result to `source.patched.ext` file, just run :

```
$> node patch.js -u v1.json v1tov2.patch
```

this will create `v1.patched.json` . 