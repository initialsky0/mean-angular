import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostService {
   private posts: Post[] = [];
   private postSubject = new Subject<{ posts: Post[], postCount: number }>();

   constructor(private http: HttpClient, private router: Router) { }

   getPost(postsPerPage: number, pageIndex: number) {
      const queryParams = `?pagesize=${postsPerPage}&page=${pageIndex}`;
      this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
         map(dbPosts => (
            {
               posts: dbPosts.posts.map(({title, content, _id, imagePath, author}) => 
                  ({ id: _id, title, content, imagePath, author })), 
               maxPost: dbPosts.maxPosts
            }
         ))
      )
      .subscribe(pipedData => {
         this.posts = pipedData.posts;
         this.postSubject.next({
            posts: [...this.posts], 
            postCount: pipedData.maxPost
         });
      });
   }

   getPostById(postId: string) {
      // local fetch post
      // return { ...this.posts.find(post => post.id === postId) };
      interface PostResponse { _id: string; title: string; content: string; imagePath: string; author: string };
      return this.http.get<PostResponse>(`http://localhost:3000/api/posts/${postId}`);
   }

   addPost(title: string, content: string, image: File) {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);

      this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(() => {
         // console.log(resData.message);
         // const post: Post = { id: resData.post.id, title, content, imagePath: resData.post.imagePath };
         // this.posts.push(post);
         // this.postSubject.next([...this.posts]);
         this.router.navigate(['/']);
      });
   }

   updatePost(id: string, title: string, content: string, image: File | string) {
      let postData: Post | FormData
      if(typeof image === 'object') {
         postData = new FormData();
         // make sure to include 'id' if method is put
         postData.append('title', title);
         postData.append('content', content);
         postData.append('image', image, title);
      } else {
         postData = { id, title, content, imagePath: image, author: null };
      }
      this.http.patch<{ message: string }>(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(() => {
         // if(editRes.message === 'Edit successful.') {
         //    const newPosts = [...this.posts];
         //    const editedPost: Post = { id, title, content, imagePath: null }
         //    newPosts.forEach((originPost, i) => {
         //       if(originPost.id === id) {
         //          newPosts[i] = editedPost;
         //       }
         //    });
         //    this.posts = newPosts;
         //    this.postSubject.next([...this.posts]);
         // }
         this.router.navigate(['/']);
      });
   }

   deletePost(postId: string) {
      return this.http.delete<{ message: string }>(`http://localhost:3000/api/posts/${postId}`);
      // .subscribe(delRes => {
      //    if(delRes.message === "Post deleted.") {
      //       this.posts = this.posts.filter(post => post.id !== postId);
      //       this.postSubject.next([...this.posts]);
      //    }
      // });
   }

   getPostObservable() {
      return this.postSubject.asObservable();
   }
}