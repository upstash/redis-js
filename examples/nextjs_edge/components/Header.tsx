import React from "react";
import { Breadcrumb, BreadcrumbProps } from "./Breadcrumb";
import StarButton from "./StarButton";

export type HeaderProps = {
  breadcrumbOptions: BreadcrumbProps;
};

export default function Header({ breadcrumbOptions }: HeaderProps) {
  return (
    <header className="relative z-10 flex items-center px-6 py-4 bg-gray-900 text-gray-50">
      <Breadcrumb {...breadcrumbOptions} />
      <div className="hidden ml-auto sm:block">
        <StarButton {...[...breadcrumbOptions?.data].pop()} />
      </div>
    </header>
  );
}
