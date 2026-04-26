export interface StallModel {
  id?: string;
  licence: string;
  password: string;
  user: UserModel;
  incomes: IncomesModel;
}

export interface UserModel {
  id?: string;
  stallId?: string;
  name: string;
  description: string;
  image: string | File;
  status?: boolean;
  openAt: string;
  closeAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomesModel {
  id?: string;
  stallId?: string;
  income: number;
  earnedAt?: string;
  createdAt?: string;
}

export const initStalls: StallModel = {
  id: "",
  licence: "",
  password: "",
  user: {
    name: "",
    description: "",
    image: "",
    openAt: "",
    closeAt: "",
  },
  incomes: {
    income: 0,
  },
};
