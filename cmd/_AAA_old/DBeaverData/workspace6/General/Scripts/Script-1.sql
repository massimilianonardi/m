-- creare 4 tabelle new_sr_agg_poly new_sr_agg_point new_atti_punti new_atti_poly



--aggiorna sr_agg_poly
TRUNCATE public.sr_agg_poly;

INSERT INTO public.sr_agg_poly( gid, geom, record, objectid, link, note_, oggetto, zto, perimetro, 
            peri_sr, atto, selezione, sr, art11, parco, centr_lo, etichetta, 
            new_etiche, record_1, variante, attuazione, lavoro, municipio)
SELECT  public.new_sr_agg_poly.gid, public.new_sr_agg_poly.geom, public.new_sr_agg_poly.record, public.new_sr_agg_poly.objectid, public.new_sr_agg_poly.link, public.new_sr_agg_poly.note_, public.new_sr_agg_poly.oggetto, public.new_sr_agg_poly.zto, public.new_sr_agg_poly.perimetro, 
            public.new_sr_agg_poly.peri_sr, public.new_sr_agg_poly.atto, public.new_sr_agg_poly.selezione, public.new_sr_agg_poly.sr, public.new_sr_agg_poly.art11, public.new_sr_agg_poly.parco, public.new_sr_agg_poly.centr_lo, public.new_sr_agg_poly.etichetta, 
            public.new_sr_agg_poly.new_etiche, public.new_sr_agg_poly.record, public.new_sr_agg_poly.variante, public.new_sr_agg_poly.attuazione, public.new_sr_agg_poly.lavoro, public.new_sr_agg_poly.municipio
FROM public.new_sr_agg_poly;



--aggiorna sr_agg_point
TRUNCATE public.sr_agg_point;

INSERT INTO public.sr_agg_point( gid, geom, record, objectid, link, note_, oggetto, zto, perimetro, 
            peri_sr, atto, selezione, sr, art11, parco, centr_lo, etichetta, 
            new_etiche, record_1, variante, attuazione, lavoro, municipio)
SELECT  public.new_sr_agg_point.gid, public.new_sr_agg_point.geom, public.new_sr_agg_point.record, public.new_sr_agg_point.objectid, public.new_sr_agg_point.link, public.new_sr_agg_point.note_, public.new_sr_agg_point.oggetto, public.new_sr_agg_point.zto, public.new_sr_agg_point.perimetro, 
            public.new_sr_agg_point.peri_sr, public.new_sr_agg_point.atto, public.new_sr_agg_point.selezione, public.new_sr_agg_point.sr, public.new_sr_agg_point.art11, public.new_sr_agg_point.parco, public.new_sr_agg_point.centr_lo, public.new_sr_agg_point.etichetta, 
            public.new_sr_agg_point.new_etiche, public.new_sr_agg_point.record, public.new_sr_agg_point.variante, public.new_sr_agg_point.attuazione, public.new_sr_agg_point.lavoro, public.new_sr_agg_point.municipio
FROM public.new_sr_agg_point;


--aggiorna sr2008_agg_poly
TRUNCATE public.sr2008_agg_poly;

INSERT INTO public.sr2008_agg_poly( gid, geom, record, objectid, link, note_, oggetto, zto, perimetro, 
            peri_sr, atto, selezione, sr, art11, parco, centr_lo, etichetta, 
            new_etiche, record_1, variante, attuazione, lavoro, municipio)
SELECT  public.new_sr_agg_poly.gid, public.new_sr_agg_poly.geom, public.new_sr_agg_poly.record, public.new_sr_agg_poly.objectid, public.new_sr_agg_poly.link, public.new_sr_agg_poly.note_, public.new_sr_agg_poly.oggetto, public.new_sr_agg_poly.zto, public.new_sr_agg_poly.perimetro, 
            public.new_sr_agg_poly.peri_sr, public.new_sr_agg_poly.atto, public.new_sr_agg_poly.selezione, public.new_sr_agg_poly.sr, public.new_sr_agg_poly.art11, public.new_sr_agg_poly.parco, public.new_sr_agg_poly.centr_lo, public.new_sr_agg_poly.etichetta, 
            public.new_sr_agg_poly.new_etiche, public.new_sr_agg_poly.record, public.new_sr_agg_poly.variante, public.new_sr_agg_poly.attuazione, public.new_sr_agg_poly.lavoro, public.new_sr_agg_poly.municipio
FROM public.new_sr_agg_poly;


--aggiorna sr2008_agg_points
TRUNCATE public.sr2008_agg_points;

INSERT INTO public.sr2008_agg_points( gid, geom, record, objectid, link, note_, oggetto, zto, perimetro, 
            peri_sr, atto, selezione, sr, art11, parco, centr_lo, etichetta, 
            new_etiche, record_1, variante, attuazione, lavoro, municipio)
SELECT  public.new_sr_agg_point.gid, public.new_sr_agg_point.geom, public.new_sr_agg_point.record, public.new_sr_agg_point.objectid, public.new_sr_agg_point.link, public.new_sr_agg_point.note_, public.new_sr_agg_point.oggetto, public.new_sr_agg_point.zto, public.new_sr_agg_point.perimetro, 
            public.new_sr_agg_point.peri_sr, public.new_sr_agg_point.atto, public.new_sr_agg_point.selezione, public.new_sr_agg_point.sr, public.new_sr_agg_point.art11, public.new_sr_agg_point.parco, public.new_sr_agg_point.centr_lo, public.new_sr_agg_point.etichetta, 
            public.new_sr_agg_point.new_etiche, public.new_sr_agg_point.record, public.new_sr_agg_point.variante, public.new_sr_agg_point.attuazione, public.new_sr_agg_point.lavoro, public.new_sr_agg_point.municipio
FROM public.new_sr_agg_point;



--aggiona sr2008_atti_punti

TRUNCATE public.sr2008_atti_punti;

INSERT INTO public.sr2008_atti_punti(gid, geom, record, objectid, link, note_, oggetto, zto, perimetro, 
            peri_sr, atto, selezione, sr, art11, parco, centr_lo, etichetta, 
            new_etiche, record_1, variante, attuazione, lavoro, municipio)
SELECT  public.new_atti_punti.gid, public.new_atti_punti.geom, public.new_atti_punti.record, public.new_atti_punti.objectid, public.new_atti_punti.link, public.new_atti_punti.note_, public.new_atti_punti.oggetto, public.new_atti_punti.zto, public.new_atti_punti.perimetro, 
            public.new_atti_punti.peri_sr, public.new_atti_punti.atto, public.new_atti_punti.selezione, public.new_atti_punti.sr, public.new_atti_punti.art11, public.new_atti_punti.parco, public.new_atti_punti.centr_lo, public.new_atti_punti.etichetta, 
            public.new_atti_punti.new_etiche, public.new_atti_punti.record, public.new_atti_punti.variante, public.new_atti_punti.attuazione, public.new_atti_punti.lavoro, public.new_atti_punti.municipio
FROM public.new_atti_punti;


--aggiona sr2008_atti_poly

TRUNCATE public.sr2008_atti_poly;

INSERT INTO public.sr2008_atti_poly(gid, geom, record, objectid, link, note_, oggetto, zto, perimetro, 
            peri_sr, atto, selezione, sr, art11, parco, centr_lo, etichetta, 
            new_etiche, record_1, variante, attuazione, lavoro, municipio)
SELECT  public.new_atti_poly.gid, public.new_atti_poly.geom, public.new_atti_poly.record, public.new_atti_poly.objectid, public.new_atti_poly.link, public.new_atti_poly.note_, public.new_atti_poly.oggetto, public.new_atti_poly.zto, public.new_atti_poly.perimetro, 
            public.new_atti_poly.peri_sr, public.new_atti_poly.atto, public.new_atti_poly.selezione, public.new_atti_poly.sr, public.new_atti_poly.art11, public.new_atti_poly.parco, public.new_atti_poly.centr_lo, public.new_atti_poly.etichetta, 
            public.new_atti_poly.new_etiche, public.new_atti_poly.record, public.new_atti_poly.variante, public.new_atti_poly.attuazione, public.new_atti_poly.lavoro, public.new_atti_poly.municipio
FROM public.new_atti_poly;
