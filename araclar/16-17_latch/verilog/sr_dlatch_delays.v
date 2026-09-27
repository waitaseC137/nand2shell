// 17 · D Latch — SR Latch'li çözüm, sekiz farklı gecikme düzeninde.
// Sınanan: d sabitken st inince bit hiçbir gecikme düzeninde kaybolmaz (döngü st'yi görmüyor).
// Beklenen çıktı: "hata = 0".
// Çalıştır: iverilog -o tbd sr_dlatch_delays.v && vvp -n tbd

// 17'deki inv'li D latch, farklı gecikmelerle: st iner, d sabit kalır
module dl #(parameter INV=1, G=1, L=1) (input st, input d, output q);
  wire nd, s, r, qb;
  not  #INV i0(nd, d);
  nand #G   g1(s, st, nd);
  nand #G   g2(r, st, d);
  nand #L   n1(qb, s, q);
  nand #L   n2(q, qb, r);
endmodule
module tb;
  reg st, d; integer hata=0, i;
  wire [7:0] q;
  dl #(1,1,1) A(st,d,q[0]); dl #(5,1,1) B(st,d,q[1]); dl #(1,5,1) C(st,d,q[2]); dl #(1,1,5) D(st,d,q[3]);
  dl #(3,2,1) E(st,d,q[4]); dl #(1,3,2) F(st,d,q[5]); dl #(4,1,3) G(st,d,q[6]); dl #(2,4,1) H(st,d,q[7]);
  initial begin
    for (i=0;i<2;i=i+1) begin
      d=i; st=1; #50;
      if (q !== {8{d}}) begin hata=hata+1; $display("yazma hatasi d=%0d q=%b", i, q); end
      st=0; #50;
      if (q !== {8{d}}) begin hata=hata+1; $display("st inince bit kayboldu d=%0d q=%b", i, q); end
    end
    $display("8 gecikme duzeni x 2 deger: hata = %0d", hata);
    $finish;
  end
endmodule
