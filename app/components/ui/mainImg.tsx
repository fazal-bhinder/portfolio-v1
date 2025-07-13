"use client";
import { cn } from "@/app/lib/utils";

export function MainImg() {
  return (
    <div className="w-[140px] h-[150px]">
      <div
        className={cn(
          "group w-full h-full cursor-pointer overflow-hidden relative card rounded-md shadow-md border border-transparent dark:border-neutral-800",
          "bg-[url(https://i.pinimg.com/736x/31/03/f7/3103f7a4e4fa6302d64c3718935a0bfb.jpg)] bg-cover bg-center",
          "hover:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)]",
          "transition-all duration-500"
        )}
      />
    </div>
  );
}
