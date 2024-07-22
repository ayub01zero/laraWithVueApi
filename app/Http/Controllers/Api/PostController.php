<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PostResource;



class PostController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->query('search'); 
        $perPage = 10; 
        $query = Post::search($search)->latest()->paginate($perPage);
    
        return PostResource::collection($query);
    }
    
    
    
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);
    
        $imagename = Str::random(32) . '.' . $request->image->getClientOriginalExtension();
        $imagePath = 'imagepost/' . $imagename;
        Storage::disk('public')->put($imagePath, file_get_contents($request->image));
            $validatedData['image'] = $imagePath;
            $validatedData['user_id'] = auth()->id();
            return Post::create($validatedData);
    }

    
    public function show(Post $post)
    {
        return new PostResource($post);
    }

  // In your PostController or equivalent
  public function UpdatePost(Request $request, Post $post)
  {
      try {
          $validated = $request->validate([
              'title' => 'required|string|max:255',
              'content' => 'required|string',
              'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
          ]);
  
          $post->update($validated);
  
          if ($request->hasFile('image')) {
              if ($post->image) {
                  Storage::disk('public')->delete($post->image);
              }
              
              if (!Storage::disk('public')->exists('imagepost')) {
                  Storage::disk('public')->makeDirectory('imagepost');
              }
              
              $path = $request->file('image')->store('imagepost', 'public');
              
              $post->image = $path;
              $post->save();
          }
  
          return new PostResource($post);
      } catch (\Exception $e) {
        return response()->json(['message' => 'An error occurred while updating the post.'], 500);
      }
  }

    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json("delete", 204);
    }


}
