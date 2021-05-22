import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostService {
   private posts: Post[] = [];
   private postSubject = new Subject<Post[]>();

   constructor(private http: HttpClient) { }

   getPost() {
      this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe(postData => {
         this.posts = postData.posts;
         this.postSubject.next([...this.posts]);
      });
   }

   addPost(title: string, content: string) {
      const post: Post = { id: null, title, content };
      this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe(resData => {
         console.log(resData.message);
         this.posts.push(post);
         this.postSubject.next([...this.posts]);
      });
   }

   getPostObservable() {
      return this.postSubject.asObservable();
   }
}