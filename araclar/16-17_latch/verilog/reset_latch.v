// 17 · D Latch ve CWE-1271 — reset girişli D Latch, kapı düzeyinde (her kapı 1 birim gecikmeli).
// Sınanan: resetsiz devre ilk yazmaya kadar x (tanımsız) gösterir; reset girişli devre reset
// sürerken ve sonrasında 1 (kilitli). Açılış değeri 0 da olsa 1 de olsa. Reset bittikten sonra normal D Latch.
// Çalıştır: iverilog -o tb reset_latch.v && vvp -n tb
// ("procedural continuous assignments" uyarısı zararsız: açılış değerini zorlamak için force kullanılıyor.)

// Kapı düzeyi, her kapı 1 birim gecikmeli.
// dlatch     : 17'deki inv'siz çözüm (reset yok)
// dlatch_rst : aynı devre + aktif düşük reset (rst_n=0 iken kilit = 1'e zorlanır)
module dlatch(input st, input d, output q);
  wire r, s, qb;
  nand #1 g1(r, st, d);
  nand #1 g2(s, st, r);
  nand #1 n1(qb, s, q);
  nand #1 n2(q, qb, r);
endmodule

module dlatch_rst(input st, input d, input rst_n, output q);
  wire rr, r, s, qb;
  nand #1 g1(rr, st, d);
  and  #1 g0(r, rr, rst_n);        // reset sürerken r = 0  →  "1 yaz"
  nand #1 g2(s, st, r, rst_n);     // reset sürerken s = 1  →  "sus"
  nand #1 n1(qb, s, q);
  nand #1 n2(q, qb, r);
endmodule

module tb;
  reg st, d, rst_n;
  wire q_eski, q_yeni;
  dlatch     A(st, d, q_eski);
  dlatch_rst B(st, d, rst_n, q_yeni);
  integer q0, i;
  initial begin
    // 1) Elektrik geldi, kimse bir şey yazmadı: 4 durumlu simülatör "x" (tanımsız) gösterir
    st=0; d=0; rst_n=0;
    #20 $display("acilis, reset suruyor : resetsiz q=%b   resetli q=%b", q_eski, q_yeni);
    rst_n=1; #20 $display("reset bitti, st=0     : resetsiz q=%b   resetli q=%b", q_eski, q_yeni);
    d=1; #20 $display("d degisti, st=0       : resetsiz q=%b   resetli q=%b", q_eski, q_yeni);
    st=1; #20 st=0; #20 $display("ilk yazma (d=1) sonra : resetsiz q=%b   resetli q=%b", q_eski, q_yeni);
    // 2) Döngü iki olası açılış değerinden biriyle başlasın (x yerine gerçek bir çip gibi)
    for (i=0; i<2; i=i+1) begin
      q0=i;
      st=0; d=0; rst_n=0;
      force B.q = q0; force B.qb = !q0; #3 release B.q; release B.qb;
      #20 $display("acilis degeri %0d, reset suruyor -> resetli q=%b (beklenen 1)", q0, q_yeni);
    end
    // 3) Reset bittikten sonra normal D latch mi?
    rst_n=1; st=1; d=0; #20 $display("st=1 d=0 -> %b (0)", q_yeni);
    st=0; #20 d=1; #20 $display("st=0, d=1 -> %b (0, duymamali)", q_yeni);
    st=1; #20 $display("st=1 d=1 -> %b (1)", q_yeni);
    st=0; #20 d=0; #20 $display("st=0, d=0 -> %b (1, duymamali)", q_yeni);
    $finish;
  end
endmodule
