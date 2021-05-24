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
   loading = false;
   private postsSub: Subscription

   constructor(private postService: PostService) { }

   ngOnInit() {
      this.loading = true;
      this.postService.getPost();
      this.postsSub = this.postService.getPostObservable().subscribe(
         (newPosts: Post[]) => {
            this.posts = newPosts;
            this.loading = false;
      });
   }

   ngOnDestroy() {
      this.postsSub.unsubscribe();
   }

   onDelete(postId: string) {
      this.postService.deletePost(postId);
   }
}