"use client";

import PageContainer from "@/app/components/container/PageContainer";
import CustomTable from "@/components/table/table";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import withAuth from "@/store/hooks/withAuth";
import { formatDate } from "@/utils/helpers";
import { deleteRequest } from "@/utils/network/handlers";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import { UserEdge, UserType } from "../../types/apps/users";
import { TableListFieldType } from "../../types/tms/common";
type StatItem = {
  key: string;
  label: string;
  backgroundColor?: string;
  color?: string;
};
const BCrumb = [
  {
    to: "/",
    title: "Нүүр"
  },
  {
    title: "Хэрэглэгчийн жагсаалт"
  }
];

const ListFields: TableListFieldType[] = [
  { label: "uuid", key: "uuid", type: "text", visible: false },
  { label: "Нэр", key: "name", type: "text", visible: true },
  {
    label: "Овог",
    key: "lastName",
    type: "text",
    visible: false
  },
  {
    label: "firstName",
    key: "firstName",
    type: "text",
    visible: false
  },
  { label: "Утас", key: "phone", type: "number", visible: true },
  {
    label: "Нэвтрэх нэр",
    key: "username",
    type: "text",
    visible: true
  },
  {
    label: "Имэйл хаяг",
    key: "email",
    type: "text",
    visible: true
  },
  {
    label: "Төлөв",
    key: "statusDisplay",
    type: "text",
    visible: true
  },
  {
    label: "Хэрэглэгчийн төрөл",
    key: "statusDisplay",
    type: "text",
    visible: true
  },
  {
    label: "Status",
    key: "status",
    type: "text",
    visible: false
  },
  {
    label: "Сүүлд нэвтэрсэн",
    key: "lastLogin",
    type: "date",
    visible: true
  },
  {
    label: "Сүүлд зассан хэрэглэгч",
    key: "lastUpdatedUserName",
    type: "text",
    visible: true
  },
  {
    label: "Сүүлд зассан огноо",
    key: "lastUpdatedDate",
    type: "date",
    visible: true
  },
  {
    label: "Хяналт",
    key: "actions",
    type: "actions",
    visible: true
  }
];

const TotalsList: StatItem[] = [
  {
    key: "databank",
    label: "Дата бэйнк",
    backgroundColor: "primary.light"
    // color: "success.main"
  },
  {
    key: "main_bank",
    label: "Банк ПОС алба",
    backgroundColor: "primary.light"
    // color: "primary.main"
  },
  {
    key: "bank",
    label: "Банк орон нутаг",

    backgroundColor: "primary.light"
    // color: "success.main"
  },
  {
    key: "loyalty_provider",
    label: "Loyalty Provider",
    backgroundColor: "primary.light"
    // color: "primary.main"
  },
  {
    key: "rbp",
    label: "RBP",
    backgroundColor: "primary.light"
  },
  {
    key: "msp",
    label: "ХСН",
    backgroundColor: "primary.light"
    // color: "primary.main"
  },
  {
    key: "merchant",
    label: "КҮБ",
    backgroundColor: "primary.light",
    // color: "success.main"
  },
  {
    key: "acquiring",
    label: "Acquiring",
    backgroundColor: "primary.light"
    // color: "primary.main"
  }
];
type TotalDictionary = {
  [key: string]: number;
};

const GET_TYPE_TOTAL = gql`
  query Users($UserType: BaseNovaUserUserTypeChoices) {
    users(userType: $UserType) {
      totalCount
      edgeCount
    }
  }
`;

const GET_USERS = gql`
  query Users(
    $first: Int
    $offset: Int
    $userType: BaseNovaUserUserTypeChoices
  ) {
    users(first: $first, offset: $offset, userType: $userType) {
      totalCount
      edgeCount
      edges {
        cursor
        node {
          username
          phone
          firstName
          lastName
          email
          source
          userType
          status
          statusDisplay
          lastLogin
          createdDate
          lastUpdatedDate
          lastUpdatedUserName
          sourceDisplay
          userTypeDisplay
          pk
          name
        }
      }
    }
    userTypeChoices {
      key
      value
    }
    statusChoices {
      key
      value
    }
    permissions {
      edges {
        node {
          uuid
          name
        }
      }
    }
  }
`;
const BoxStyled = styled(Box)(() => ({
  padding: "10px",
  transition: "0.1s ease-in",
  cursor: "pointer",
  color: "inherit",
  "&:hover": {
    transform: "scale(1.03)"
  }
}));
const User = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  const [userTypeTotals, setUserTypeTotals] = useState<TotalDictionary>();
  const [filterUserType, setFilterUserType] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const { data, fetchMore, loading } = useQuery(GET_USERS, {
    variables: {
      first: rowsPerPage,
      offset: page * rowsPerPage,
      userType: filterUserType
    }
  });
  const { fetchMore: fetchMoreUserTypeData } = useQuery(GET_TYPE_TOTAL, {
    variables: {
      UserType: "DATABANK"
    }
  });
  const items = data?.users?.edges.map((edge: UserEdge) => edge.node);

  const userTypeChoicesDict: Record<string, string> = {};
  data?.userTypeChoices?.map((choice: { key: string; value: string }) => {
    userTypeChoicesDict[choice.key] = choice.value;
  });

  useEffect(() => {
    const fetchTotals = async () => {
      if (userTypeTotals) return;
      data?.userTypeChoices?.map(
        async (choice: { key: string; value: string }) => {
          const result = await fetchMoreUserTypeData({
            variables: {
              UserType: choice.key.toUpperCase()
            }
          });
          const userTypeData = result.data;
          setUserTypeTotals((prevValues) => ({
            ...prevValues,
            [choice.key]: userTypeData.users.totalCount
          }));
        }
      );
    };

    if (!loading) {
      fetchTotals();
    }
  }, [loading]);

  useEffect(() => {
    setPage(0);
  }, [filterUserType]);

  useEffect(() => {
    if (!filterUserType) {
      setTotal(data?.users?.totalCount);
    }
  }, [loading]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rpp = parseInt(event.target.value);
    setPage(0);
    setRowsPerPage(rpp);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const onClickCreate = () => {
    router.push(`${pathname}/create`);
  };

  const deleteClickHandler = (uuid: string) => async () => {
    await deleteRequest(`/user/delete/${uuid}/`)
      .then((res) => {
        if (res.status_code == "ok") {
          toast.success("Амжилттай устгагдлаа.", {
            position: "top-right",
            duration: 3000
          });
          fetchMore({
            variables: {
              first: rowsPerPage
            }
          });
        } else if (res.status_code == "ng") {
          if (res?.msg)
            toast.error(res?.msg.body, {
              position: "top-right",
              duration: 3000
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <PageContainer
      title="Хэрэглэгчийн жагсаалт"
      description="Хэрэглэгчийн жагсаалт"
    >
      <Breadcrumb title="Хэрэглэгчийн жагсаалт" items={BCrumb} />

      <Grid container spacing={3} textAlign="center">
        <Grid item xs={0} md={0} lg={12 / (TotalsList.length + 1)}>
          <BoxStyled
            onClick={() => {
              setFilterUserType("DATABANK");
            }}
            sx={{
              backgroundColor: "primary.light"
              // color: "primary.main"
            }}
          >
            <Typography variant="h3">{total ?? 0}</Typography>
            <Typography variant="h6">Нийт</Typography>
          </BoxStyled>
        </Grid>
        {TotalsList.map((total, index) => (
          <Grid
            item
            xs={0}
            md={0}
            lg={12 / (TotalsList.length + 1)}
            key={index}
          >
            <BoxStyled
              onClick={() => {
                setFilterUserType(total.key.toUpperCase());
              }}
              sx={{
                backgroundColor: total.backgroundColor,
                color: total.color
              }}
            >
              <Typography variant="h3">
                {userTypeTotals?.[total.key] || 0}
              </Typography>
              <Typography variant="h6">{total.label}</Typography>
            </BoxStyled>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <CustomTable
          totalCount={data?.users?.totalCount}
          page={page}
          isLoading={loading}
          onPageChange={handleChangePage}
          fields={ListFields}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onClickCreate={onClickCreate}
        >
          {items?.map((row: UserType, index: number) => (
            <TableRow key={index} hover>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.name}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.phone}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.username}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.email}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.statusDisplay}
                </TypoToolTip>
              </TableCell>

              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.userTypeDisplay}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {String(formatDate(row.lastLogin))}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.lastUpdatedUserName}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {String(formatDate(row.lastUpdatedDate))}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <>
                  <IconButton
                    id={`basic-button-${index}`}
                    aria-controls={
                      actionMenuOpen === index ? "basic-menu" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={
                      actionMenuOpen === index ? "true" : undefined
                    }
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      setAnchorEl(event.currentTarget);
                      setActionMenuOpen(index); // Set the open menu to the current row's index
                    }}
                  >
                    <IconDotsVertical width={18} />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={actionMenuOpen === index}
                    onClose={() => {
                      setAnchorEl(null);
                      setActionMenuOpen(null);
                    }}
                    MenuListProps={{
                      "aria-labelledby": "basic-button"
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        router.push(`${pathname}/edit/${row.pk}`);
                      }}
                    >
                      <ListItemIcon>
                        <IconEdit width={18} />
                      </ListItemIcon>
                      Засах
                    </MenuItem>
                    <MenuItem onClick={deleteClickHandler(row.pk as string)}>
                      <ListItemIcon>
                        <IconTrash width={18} />
                      </ListItemIcon>
                      Устгах
                    </MenuItem>
                  </Menu>
                </>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      </Box>
    </PageContainer>
  );
};
export default withAuth(User);
