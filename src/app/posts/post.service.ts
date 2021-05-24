import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostService {
   private posts: Post[] = [];
   private postSubject = new Subject<Post[]>();

   constructor(private http: HttpClient, private router: Router) { }

   getPost() {
      this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(
         map(dbPosts => dbPosts.posts.map(
            ({title, content, _id}) => ({ id: _id, title, content })
         ))
      )
      .subscribe(pipedData => {
         this.posts = pipedData;
         this.postSubject.next([...this.posts]);
      });
   }

   getPostById(postId: string) {
      // local fetch post
      // return { ...this.posts.find(post => post.id === postId) };
      interface PostResponse { _id: string; title: string; content: string };
      return this.http.get<PostResponse>(`http://localhost:3000/api/posts/${postId}`);
   }

   addPost(title: string, content: string) {
      const post: Post = { id: null, title, content };
      this.http.post<{ message: string, id: string }>('http://localhost:3000/api/posts', post)
      .subscribe(resData => {
         console.log(resData.message);
         post.id = resData.id;
         this.posts.push(post);
         this.postSubject.next([...this.posts]);
         this.router.navigate(['/']);
      });
   }

   updatePost(id: string, title: string, content: string) {
      const post: Post = { id, title, content };
      this.http.patch<{ message: string }>(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(editRes => {
         if(editRes.message === 'Edit successful.') {
            const newPosts = [...this.posts];
            newPosts.forEach((originPost, i) => {
               if(originPost.id === id) {
                  newPosts[i] = post;
               }
            });
            this.posts = newPosts;
            this.postSubject.next([...this.posts]);
            this.router.navigate(['/']);
         }
      });
   }

   deletePost(postId: string) {
      this.http.delete<{ message: string }>(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(delRes => {
         if(delRes.message === "Post deleted.") {
            this.posts = this.posts.filter(post => post.id !== postId);
            this.postSubject.next([...this.posts]);
         }
      });
   }

   getPostObservable() {
      return this.postSubject.asObservable();
   }
}