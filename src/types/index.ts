export interface DiaPhuong {
  tinh_thanh: string;
  quan_huyen: string;
  xa_phuong: string;
  dia_chi: string;
}

export interface ToaDo {
  vi_do: number | null;
  kinh_do: number | null;
}

export interface LeThuc {
  tieu_de: string;
  thoi_gian?: string;
  noi_dung: string;
  ma_nguon?: string;
}

export interface TruyenThuyet {
  tieu_de: string;
  noi_dung: string;
  tinh_chat?: string;
  ma_nguon?: string;
}

export interface LichSuHinhThanh {
  giai_doan: string;
  noi_dung: string;
  ma_nguon?: string;
}

export interface ThongTinGhiDanh {
  danh_hieu: string;
  co_quan: string;
  nam: number | null;
  van_ban?: string;
  ma_nguon?: string;
}

export interface HinhAnhTuLieu {
  url: string;
  chu_thich: string;
  nguon_anh: string;
  ban_quyen?: string;
}

export interface HoSoDiSan {
  id: string;
  ten_chinh_thuc: string;
  ten_goi_khac: string[];
  nhom_chu_de: string;
  loai_hinh: string;
  nhan_vat_tho_phung: string[];
  dia_phuong: DiaPhuong;
  toa_do: ToaDo;
  mo_ta_dac_trung: string;
  le_thuc: LeThuc[];
  truyen_thuyet: TruyenThuyet[];
  lich_su_hinh_thanh: LichSuHinhThanh[];
  thong_tin_ghi_danh: ThongTinGhiDanh[];
  hinh_anh_tu_lieu: HinhAnhTuLieu[];
  nguon_tu_lieu: string[];
  trang_thai_xac_minh: 'da_xac_minh' | 'chua_xac_minh';
  ngay_cap_nhat: string;
}

export interface NguonTuLieu {
  id: string;
  ten_tai_lieu: string;
  tac_gia_hoac_co_quan: string;
  nam_xuat_ban: number | null;
  loai_nguon: string;
  url: string;
  ngay_kiem_tra_url: string;
  noi_dung_ho_tro: string;
  trang_hoac_vi_tri: string;
  trang_thai_xac_minh: 'da_xac_minh' | 'chua_xac_minh';
}

export interface GeminiQAResponse {
  cau_tra_loi: string;
  ho_so_su_dung: Array<{ id: string; ten_chinh_thuc?: string }>;
  truong_du_lieu: string[];
  nguon_trich_dan: NguonTuLieu[];
  trang_thai?: string;
}
