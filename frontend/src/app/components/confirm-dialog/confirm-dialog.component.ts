import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit{
  translatedTitle!: string;
  translatedMessage!: string;
  translatedConfirmText!: string;
  translatedCancelText!: string;
  translatedOkText!: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      message: string,
      isConfirm?: boolean,
      confirmText?: string,
      cancelText?: string,
      okText?: string
    },
    private translate: TranslateService
  ) {  }

  ngOnInit(): void {
    this.translate.get(this.data.title).subscribe(translation => this.translatedTitle = translation);
    this.translate.get(this.data.message).subscribe(translation => this.translatedMessage = translation);
    if (this.data.isConfirm) {
      this.translate.get(this.data.confirmText || 'dialog.button.confirm').subscribe(translation => this.translatedConfirmText = translation);
      this.translate.get(this.data.cancelText || 'dialog.button.cancel').subscribe(translation => this.translatedCancelText = translation);
    } else {
      this.translate.get(this.data.okText || 'dialog.button.ok').subscribe(translation => this.translatedOkText = translation);
    }
  }

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
