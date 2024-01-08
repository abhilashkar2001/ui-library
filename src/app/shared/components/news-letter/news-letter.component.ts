import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-news-letter",
  templateUrl: "./news-letter.component.html",
  styleUrls: ["./news-letter.component.scss"],
})
export class NewsLetterComponent implements OnInit {
  emailForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
    });
  }

  ngOnInit(): void {}
}
