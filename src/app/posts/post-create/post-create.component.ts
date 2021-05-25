import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
   selector: 'app-post-create', 
   templateUrl: './post-create.component.html', 
   styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
   constructor(
      private postService: PostService, 
      private actRoute: ActivatedRoute
   ) { }
   editPost: Post;
   postForm: FormGroup;
   imgPreview: string;
   loading = false;
   private postId: string;
   private editMode = false;
   
   ngOnInit() {
      // initiate formgroup
      this.postForm = new FormGroup({
         'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }), 
         'content': new FormControl(null, { validators: [Validators.required] }), 
         'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
      })

      // preload content for post edit mode when refresh
      this.actRoute.paramMap.subscribe((paramMap: ParamMap) => {
         if(paramMap.has('postId')) {
            this.editMode = true;
            this.postId = paramMap.get('postId');
            this.loading = true;
            this.postService.getPostById(this.postId).subscribe(
               postRes => {
                  this.loading = false;
                  if(postRes?._id) {
                     this.editPost = {
                        id: postRes._id, 
                        title: postRes.title, 
                        content: postRes.content, 
                        imagePath: postRes.imagePath
                     };
                     this.postForm.setValue({ 'title': postRes.title, 'content': postRes.content, 'image': postRes.imagePath });
                  }
               }
            );
         } else {
            this.editMode = false;
            this.postId = null;
            this.editPost = null;
         }
      });
   }

   onImgSelected(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      if(file) {
         this.postForm.patchValue({ 'image': file });
         this.postForm.get('image').updateValueAndValidity();
         const reader = new FileReader();
         reader.onload = () => {
            this.imgPreview = reader.result as string;
         };
         reader.readAsDataURL(file);
      }
   }

   onSubmit() {
      if(this.postForm.invalid) return;
      this.loading = true;
      if(!this.editMode) {
         this.postService.addPost(
            this.postForm.value.title, 
            this.postForm.value.content, 
            this.postForm.value.image
         );
      } else {
         this.postService.updatePost(
            this.postId, 
            this.postForm.value.title, 
            this.postForm.value.content, 
            this.postForm.value.image
         );
      }
      this.postForm.reset();
   }
}