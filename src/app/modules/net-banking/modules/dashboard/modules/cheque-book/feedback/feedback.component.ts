import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ChequeService } from "../cheque-service";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"],
})
export class FeedbackComponent implements OnInit {
  value = "";
  showKeyboard: boolean = true;
  feedbackRating: FormControl = new FormControl();
  suggestions: FormControl = new FormControl("");
  buttonStatus: any = {
    text: "Submit",
    loading: false,
  };

  constructor(private router: Router, private feedbackService: ChequeService) {}

  ngOnInit(): void {}

  handleEmojiClick(selectedIndex: number) {
    this.feedbackRating.setValue(selectedIndex + 1);

    const emojiBox = document.querySelectorAll(".rating_emoji");
    const emojis = document.querySelectorAll(".rating_emoji img");
    emojis.forEach((emoji, index) => {
      const distance = index - selectedIndex;
      let transformValue = "";
      if (distance === 0) {
        // Center the selected emoji
        transformValue = "translateX(0%) scale(1.2)";
        emoji.classList.add("selected");
      } else if (distance > 0) {
        // Slide emojis to the right
        transformValue = `translateX(${distance * 10 + 10}%)`;
        emoji.classList.remove("selected");
      } else {
        // Slide emojis to the left
        transformValue = `translateX(${distance * 10 - 10}%)`;
        emoji.classList.remove("selected");
      }
      // (emoji as HTMLElement).style.transform = transformValue;
      (emojiBox[index] as HTMLElement).style.transform = transformValue;
    });
  }

  onChange = (input: string) => {
    this.value = input;
    this.suggestions.setValue(this.value);
  };

  onInputChange = (event: any) => {
    this.value = event.target.value;
  };

  complete() {
    const payload = {
      customerId: JSON.parse(sessionStorage.getItem("customer-Info"))
        ?.customerId,
      feedbackRating: this.feedbackRating.value,
      suggestions: this.suggestions.value,
    };
    this.feedbackService.saveFeedback(payload).subscribe((res: any) => {
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        this.router.navigate(["/dashboard"]);
      }
    });
  }
}
