import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
   selector: 'app-post-list', 
   templateUrl: './post-list.component.html', 
   styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
   posts: Post[] = [];
   private postsSub: Subscription

   constructor(private postService: PostService) { }

   ngOnInit() {
      this.postService.getPost();
      this.postsSub = this.postService.getPostObservable().subscribe(
         (newPosts: Post[]) => {
            this.posts = newPosts;
      });
   }

   ngOnDestroy() {
      this.postsSub.unsubscribe();
   }
}