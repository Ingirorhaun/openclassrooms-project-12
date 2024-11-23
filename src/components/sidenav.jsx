import { IconBike } from "./icons/icon-bike";
import { IconDumbbell } from "./icons/icon-dumbbell";
import { IconSwim } from "./icons/icon-swim";
import { IconYoga } from "./icons/icon-yoga";

export const SideNav = () => {
  return (
    <aside className="sidenav">
      <nav>
        <a href="#">
          <IconYoga />
        </a>
        <a href="#">
          <IconSwim />
        </a>
        <a href="#">
          <IconBike />
        </a>
        <a href="#">
          <IconDumbbell />
        </a>
      </nav>
      <p>Copyright, SportSee 2020</p>
    </aside>
  );
};
