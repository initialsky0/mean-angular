import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
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
   authState = false;
   userId: string;
   totolPosts = 0;
   postsPerPage = 2;
   pageIndex = 1;
   pageSizeOptions = [1, 2, 5, 10];
   private postsSub: Subscription;
   private authStateSub: Subscription;

   constructor(
      private postService: PostService, 
      private authService: AuthService
   ) { }

   ngOnInit() {
      this.loading = true;
      this.postService.getPost(this.postsPerPage, this.pageIndex);
      this.userId = this.authService.userId;
      this.postsSub = this.postService.getPostObservable().subscribe(
         (postData: { posts: Post[], postCount: number }) => {
            this.loading = false;
            this.posts = postData.posts;
            this.totolPosts = postData.postCount;
      });
      this.authState = this.authService.userAuthState;
      this.authStateSub = this.authService.getAuthStateListener().subscribe(
         (isAuth) => {
            this.authState = isAuth;
            this.userId = this.authService.userId;
      });
   }

   ngOnDestroy() {
      if(this.postsSub?.unsubscribe) this.postsSub.unsubscribe();
      if(this.authStateSub?.unsubscribe) this.authStateSub.unsubscribe();
   }

   onDelete(postId: string) {
      this.loading = true;
      // originally not subscribe here
      this.postService.deletePost(postId).subscribe(() => {
         this.postService.getPost(this.postsPerPage, this.pageIndex);
      }, () => {
         this.loading = false;
      });
   }

   onChangePage(pageData: PageEvent) {
      this.loading = true;
      this.postsPerPage = pageData.pageSize;
      this.pageIndex = pageData.pageIndex + 1;
      this.postService.getPost(this.postsPerPage, this.pageIndex);
   }
}