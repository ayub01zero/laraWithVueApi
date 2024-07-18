<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{


    public function index(Request $request)
    {
        $search = $request->query('search'); 
        $perPage = 10; 
        $query = Post::search($search)->latest()->paginate($perPage);
    
        return response()->json($query);
    }
    
    
    
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
          
        ]);
            $validatedData['user_id'] = auth()->id(); 

        return Post::create($validatedData);
    }
    
    public function show(Post $post)
    {
        return $post;
    }

    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'required',
        ]);

        $post->update($request->all());

        return $post;
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json(null, 204);
    }


}
