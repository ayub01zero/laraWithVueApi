<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel & VueJs</title>
        @vite(['resources/css/app.css','resources/js/app.js'])
       
    </head>
    <body class="dark:bg-gray-900">
        <div id="app">
            <router-view></router-view>
        </div>
    </body>
</html>
