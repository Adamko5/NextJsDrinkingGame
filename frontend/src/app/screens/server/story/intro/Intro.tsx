"use client";

import StoryTelling1 from "../../general/story_telling_1/StoryTelling";
import story from "./story";

export default function StoryTellingIntro() {  
  return (
    <StoryTelling1 inputStory={story}></StoryTelling1>
  );
}