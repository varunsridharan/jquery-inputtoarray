# jquery-inputtoarray
### Usage
```html
<script src="http://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        crossorigin="anonymous"></script>
<script src="intputtoarray.js"></script>
<script>
    $(document).ready(function () {
        console.log($('input#ToArray').inputToArray());
    })
</script>


<div class="form">
    <input type="text" id="ToArray" name="groups[level1][level2][level3]" value="This is the value"/>>
</div>
```
