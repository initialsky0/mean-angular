import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

// <{ [key: string]: any }> is generic typing for object
export const mimeType = (control: AbstractControl): 
Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
   if(typeof(control.value) === 'string') {
      // exit if control type is string
      return of(null);
   }
   const file = control.value as File;
   const fReader = new FileReader();
   const fileObs = new Observable((observer: Observer<{ [key: string]: any }>) => {
      fReader.addEventListener('loadend', () => {
         // check for mime type here
         const typeArr = new Uint8Array(fReader.result as Uint8Array).subarray(0, 4);
         let header = '';
         let isValid = false;
         for(let i = 0; i < typeArr.length; i++) {
            header += typeArr[i].toString(16);
         }
         switch(header) {
            case "89504e47":
               isValid = true;
               break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
               isValid = true;
               break;
            default:
               isValid = false;
               break;
         }
         if(isValid) {
            observer.next(null);
         } else {
            observer.next({ invalidMimeType: true });
         }
         observer.complete();
      });
      fReader.readAsArrayBuffer(file);
   });
   return fileObs;
}