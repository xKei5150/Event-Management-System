import React from 'react';
import {Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, ChevronRightIcon} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {BiChevronRight} from "react-icons/bi";

const BreadcrumbsComponent = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    // Define the starting index for breadcrumb (0 for root, 1 to skip one segment, etc.)
    const breadcrumbStartIndex = 2;

    return (
        <Box bg="gray.100" p="1" mb="2">
            <Breadcrumb spacing="8px" separator={<BiChevronRight color="gray.500" />}>
                {/* Optionally, you can also remove the Home breadcrumb item if not at the root level */}
                {breadcrumbStartIndex === 0 && (
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} to="/">
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}

                {pathnames.slice(breadcrumbStartIndex).map((name, index) => {
                    // Adjust the index because of the slice
                    index += breadcrumbStartIndex;

                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                        <BreadcrumbItem key={name} isCurrentPage={isLast}>
                            {!isLast ? (
                                <BreadcrumbLink as={Link} to={routeTo}>
                                    {name}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbLink as={Link} to={routeTo} isCurrentPage>
                                    {name}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </Breadcrumb>
        </Box>

    );
};

export default BreadcrumbsComponent;
