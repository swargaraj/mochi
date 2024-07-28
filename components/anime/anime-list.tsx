import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import Link from "next/link";
import Image from "next/image";

import WatchListIcon from "@/components/ui/WatchListIcon";
import { Skeleton } from "@/components/ui/skeleton";

import { AnilistResult } from "@/types/anime";
import { TvMinimal } from "lucide-react";

import { useUser } from "@/app/_components/context";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * Interface for the SearchResults component.
 * @interface SearchResultsProps
 * @property {string} type - The type of the results display.
 * @property {Array<AnilistResult>} list - The list of anime results.
 */

interface SearchResultsProps {
  type: "default" | "search";
  list: AnilistResult[];
}

/**
 * Returns the CSS class name for the list container.
 * @function listVariants
 * @param {VariantProps} props - The props object containing the type.
 * @returns {string} - The CSS class name.
 */
const listVariants = cva("mt-6 grid grid-cols-2 gap-2 lg:gap-4 select-none", {
  variants: {
    type: {
      default: "sm:grid-cols-4 lg:grid-cols-5",
      search: "sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

/**
 * Renders a list of anime results.
 * @function AnimeList
 * @param {SearchResultsProps} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
export function AnimeList({ type, list }: SearchResultsProps) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = useUser();

  const isLoggedIn = !!user;

  const addToWatchListHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    if (isLoggedIn){
      addAnimeToWatchList(id);
    }
    else{
      setIsDialogOpen(true);
    }
  }; 

  const addAnimeToWatchList = (id: string) => {
    // TODO: Implement the actual adding to watch list functionality
    console.log(`Adding anime with ID ${id} to watch list`);
  }

  return (
    <>
      <div className={cn(listVariants({ type }))}>
        {/* Map over the anime list and render each anime component */}
        {list.map((anime, index) => (
          <div
            key={index}
            className="group relative overflow-hidden shadow-lg p-2 rounded-lg"
          >
            <Link href={`/anime/${anime.id}`}>
              <div className="relative">
                {/* Render the anime image */}
                <Image
                  loading="lazy"
                  src={anime.image || "default.png"}
                  alt={
                    anime.title.english || anime.title.userPreferred || "No Title"
                  }
                  width={460}
                  height={650}
                  className="object-cover w-full h-[300px] lg:h-[370px] rounded-lg transition-all hover:opacity-80"
                />
                {/* Render the anime details */}
                <div className="absolute flex w-11/12 justify-between top-2 left-2">
                  <div className="flex">
                    <div
                      className={`bg-purple-800 text-white text-xs font-semibold  px-2 py-1 ${
                        anime.totalEpisodes ? "rounded-tl rounded-bl" : "rounded"
                      }`}
                    >
                      {/* Render the anime type */}
                      {(anime.type || "").replace(/_/g, " ")}
                    </div>
                    {/* Render the anime total episodes */}
                    {anime.totalEpisodes && (
                      <div className="bg-teal-600 text-white text-xs font-semibold rounded-tr rounded-br px-2 py-1 flex items-center">
                        <TvMinimal className="h-3 w-3 mr-1" />
                        {anime.totalEpisodes}
                      </div>
                    )}
                  </div>
                  <WatchListIcon
                    id={anime.id}
                    addToWatchList={addToWatchListHandler}
                  ></WatchListIcon>
                </div>
                {/* Render the anime gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-10% from-black via-[transparent] to-transparent opacity-70 rounded-lg pointer-events-none"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                {/* Render the anime title */}
                <h2 className="text-md lg:text-lg lg:w-[80%] font-semibold leading-5">
                  {(
                    anime.title.english ||
                    anime.title.userPreferred ||
                    "No Title"
                  ).length > 40
                    ? (
                        anime.title.english ||
                        anime.title.userPreferred ||
                        "No Title"
                      ).slice(0, 37) + "..."
                    : anime.title.english ||
                      anime.title.userPreferred ||
                      "No Title"}
                </h2>
                {/* Render the anime release date and status */}
                <p className="text-sm mt-1">
                  {anime.releaseDate} • {anime.status}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to add anime to your watch list. Please log in or sign up.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex custom-dialog-footer items-center">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <div className="flex justify-end space-x-2">
              <div className="gap-2 flex">
                <Link href={"/join"}>
                  <Button variant="secondary">
                    Become a Member
                  </Button>
                </Link>
                <Link href={"/login"}>
                  <Button>Login</Button>
                </Link>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Renders a skeleton of anime results.
 * @function AnimeListSkeleton
 * @param {Omit<SearchResultsProps, "list">} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
export function AnimeListSkeleton({ type }: Omit<SearchResultsProps, "list">) {
  return (
    <div className={cn(listVariants({ type }))}>
      {/* Map over the number of anime results and render each skeleton */}
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="group relative overflow-hidden shadow-lg p-2 rounded-lg"
          >
            {/* Render the anime image skeleton */}
            <Skeleton className="object-cover w-full h-[300px] lg:h-[370px] rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              {/* Render the anime details skeleton */}
              <Skeleton className="text-md lg:text-lg lg:w-[80%] font-semibold leading-5" />
              <Skeleton className="text-sm mt-1" />
            </div>
          </div>
        ))}
    </div>
  );
}
